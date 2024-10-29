import { useState, useEffect } from "react";
import {
    Container,
    Typography,
    Card,
    CardContent,
    Button,
    List,
} from "@mui/material";
import axios from "axios";

const UserDashboard = () => {
    const [quizzes, setQuizzes] = useState([]);

    useEffect(() => {
        const fetchQuizzes = async () => {
            try {
                const response = await axios.get(
                    "http://127.0.0.1:5000/quizzes"
                );
                setQuizzes(response.data);
            } catch (error) {
                console.error("Failed to fetch quizzes:", error);
            }
        };
        fetchQuizzes();
    }, []);

    const renderQuiz = (quiz) => (
        <Card key={quiz.id} sx={{ mb: 2 }}>
            <CardContent>
                <Typography variant="h7" gutterBottom>
                    {quiz.name}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                    {quiz.description}
                </Typography>
                <Button
                    variant="contained"
                    color="primary"
                    sx={{ mt: 2, fontSize: "0.75rem", padding: "6px 12px" }}
                >
                    Start Quiz
                </Button>
            </CardContent>
        </Card>
    );

    return (
        <Container component="main" maxWidth="sm">
            <Typography variant="h2" gutterBottom>
                User Dashboard
            </Typography>
            <Typography variant="h4">Available Quizzes</Typography>
            {quizzes.length > 0 ? (
                <List dense>{quizzes.map(renderQuiz)}</List>
            ) : (
                <Typography variant="body1" color="text.secondary">
                    No quizzes available yet.
                </Typography>
            )}
        </Container>
    );
};

export default UserDashboard;
