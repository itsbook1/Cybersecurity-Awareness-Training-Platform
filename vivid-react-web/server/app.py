from flask import Flask, request, jsonify, make_response
from flask_sqlalchemy import SQLAlchemy
from werkzeug.security import generate_password_hash, check_password_hash
from mcq_to_json import generate_questions, extract_text_from_pdf, save_questions_to_csv
from flask_jwt_extended import (
    JWTManager,
    create_access_token,
    jwt_required,
    get_jwt_identity,
)
from flask_cors import CORS
from mcq_to_json import generate_questions, extract_text_from_pdf, save_questions_to_csv
from flask_restful import Resource, Api
import os
from datetime import timedelta
import os

app = Flask(__name__)

CORS(
    app,
    supports_credentials=True,
    resources={r"/*": {"origins": "http://localhost:5173"}},
)

app.config["SECRET_KEY"] = "e5f6c1d6f8e9134b2246a4c7ea1a6f72"
app.config["SQLALCHEMY_DATABASE_URI"] = "sqlite:///site.db"
app.config["JWT_SECRET_KEY"] = "SECRET_KEY_qjwkdhjqhwdbqhwdq"
app.config["UPLOAD_FOLDER"] = "./uploads"

db = SQLAlchemy(app)
jwt = JWTManager(app)
api = Api(app)


class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(20), unique=True, nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password = db.Column(db.String(60), nullable=False)
    is_admin = db.Column(db.Boolean, default=False)


class Assignment(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    pdf_path = db.Column(db.String(120), nullable=False)
    quiz_path = db.Column(db.String(120), nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey("user.id"), nullable=False)


class Login(Resource):
    def post(self):
        data = request.get_json()
        email = data.get("email", "")
        password = data.get("password", "")
        remember = data.get("remember", False)

        user = User.query.filter_by(email=email).first()

        if user and check_password_hash(user.password, password):
            expires = timedelta(days=7) if remember else timedelta(minutes=15)
            access_token = create_access_token(identity=user.id, expires_delta=expires)

            response = make_response(
                jsonify(
                    {
                        "message": "Login successful",
                        "access_token": access_token,
                        "user": {"username": user.username, "is_admin": user.is_admin},
                    }
                ),
                200,
            )

            return response

        return make_response(jsonify({"message": "Login failed"}), 401)


class Register(Resource):
    def post(self):
        data = request.get_json()
        username = data.get("username")
        email = data.get("email")
        password = data.get("password")

        # Check if the email already exists
        existing_user = User.query.filter_by(email=email).first()
        if not existing_user:
            # Hash the password
            hashed_password = generate_password_hash(password, method="scrypt")

            user = User(username=username, email=email, password=hashed_password)
            db.session.add(user)
            db.session.commit()

            response = make_response(
                jsonify(
                    {
                        "message": "Registration was successful",
                    }
                ),
                200,
            )

            return response

        return make_response(jsonify({"message": "Registration failed"}), 401)


class UserData(Resource):
    @jwt_required()
    def get(self):
        user_id = get_jwt_identity()
        user = User.query.get(user_id)

        if user:
            user_data = {
                "username": user.username,
                "email": user.email,
                "is_admin": user.is_admin,
            }
            return jsonify(user_data)

        return make_response(jsonify({"message": "User not found"}), 404)


class Admin(Resource):
    def post(self):
        if "file" not in request.files or "user_id" not in request.form:
            return make_response(jsonify({"message": "Missing required fields"}), 400)
        pdf_file = request.files["file"]
        user_id = request.form["user_id"]
        pdf_path = f"upload/pdfs/{pdf_file.filename}"
        pdf_file.save(pdf_path)
        
        extracted_text = extract_text_from_pdf(pdf_path)
        questions_text = generate_questions(extracted_text)
        
        quizzes_dir = "upload/quizzes"
        if not os.path.exists(quizzes_dir):
            os.makedirs(quizzes_dir)
        
        csv_path = os.path.join(quizzes_dir, f"{user_id}_quiz.csv")
        save_questions_to_csv(questions_text, csv_path)

        # Create an assignment
        assignment = Assignment(pdf_path=pdf_path, quiz_path=csv_path, user_id=user_id)
        db.session.add(assignment)
        db.session.commit()

        # Create a notification for the user
        create_notification(user_id, assignment.id, "A new quiz has been assigned to you!")
        
        return make_response(
            jsonify({"message": "Assignment and notification created successfully!"}), 201
        )

     
class Quizzes(Resource):
    @jwt_required()
    def get(self):
        user_id = get_jwt_identity()
        assignments = Assignment.query.filter_by(user_id=user_id).all()
        quizzes = [
            {
                "id": assignment.id,
                "name": os.path.splitext(os.path.basename(assignment.pdf_path))[0],
                "pdf_path": assignment.pdf_path,
                "quiz_path": assignment.quiz_path,
                "user_id": assignment.user_id,
            }
            for assignment in assignments
        ]
        return jsonify(quizzes)

api.add_resource(Login, "/login")
api.add_resource(Register, "/register")
api.add_resource(UserData, "/user-data")
api.add_resource(Admin, "/admin")
api.add_resource(Quizzes, "/quizzes")

if __name__ == "__main__":
    with app.app_context():
        db.create_all()
        # assignments = Assignment.query.all()
        # for assignment in assignments:
        #     print(
        #         f"Assignment ID: {assignment.id}, PDF Path: {assignment.pdf_path}, Quiz Path: {assignment.quiz_path}, User ID: {assignment.user_id}"
        #     )

        admin_user = User.query.filter_by(username="admin").first()
        if admin_user:
            db.session.delete(admin_user)
            db.session.commit()

        if not User.query.filter_by(username="admin").first():
            admin = User(
                username="admin",
                email="admin@example.com",
                password=generate_password_hash("garrett", method="scrypt"),
                is_admin=True,
            )
            db.session.add(admin)
            db.session.commit()
            print("Created admin with login credentials: admin@example.com : garrett")

    app.run(debug=True)
