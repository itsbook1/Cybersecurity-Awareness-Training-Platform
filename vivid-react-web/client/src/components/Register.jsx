import {
    TextField,
    Button,
    Container,
    CssBaseline,
    Box,
    Typography,
    Link,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import axios from "axios";
import { useMutation } from "@tanstack/react-query";

const Register = () => {
    const [formData, setFormData] = useState({
        email: "",
        username: "",
        password: "",
    });

    const [confirmPassword, setConfirmPassword] = useState("");
    const [errors, setErrors] = useState({});
    const navigate = useNavigate(); 

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevFormData) => ({
            ...prevFormData,
            [name]: value,
        }));
    };

    // Function to validate password complexity
    const validatePasswordComplexity = (password) => {
        const complexityRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
        return complexityRegex.test(password);
    };

    const validateForm = () => {
        let formErrors = {};

        if (!formData.email) {
            formErrors.email = "Please enter an email.";
        }
        if (!formData.username) {
            formErrors.username = "Please enter a username.";
        }
        if (!formData.password) {
            formErrors.password = "Please enter a password.";
        } else if (!validatePasswordComplexity(formData.password)) {
            formErrors.password = "Password must be at least 8 characters long, include at least one uppercase letter, one lowercase letter, one number, and one special character.";
        }
        if (formData.password !== confirmPassword) {
            formErrors.confirmPassword = "Passwords do not match. Try again.";
        }

        setErrors(formErrors);

        return Object.keys(formErrors).length === 0;
    };

    const mutation = useMutation({
        mutationFn: async (formData) => {
            const response = await axios.post(
                "http://localhost:5000/register",
                formData
            );
            return response.data;
        },
        onSuccess: () => {
            navigate("/login");
        },
        onError: (error) => {
            alert("Registration failed: " + (error.response?.data?.message || error.message));
        },
    });

    const handleSubmit = (e) => {
        e.preventDefault();

        if (validateForm()) {
            mutation.mutate(formData);
        }
    };

    return (
        <Container component="main" maxWidth="xs">
            <CssBaseline />
            <Box
                sx={{
                    display: "flex",
                    justifyContent: "center",
                    minHeight: "100vh",
                    flexDirection: "column",
                    alignItems: "center",
                }}
            >
                <Box m={1.5}>
                    <img
                        src="../vivid.png"
                        className="Logo"
                        alt="logo"
                        width={250}
                        height={200}
                        style={{
                            position: 'relative',
                            right: '25px'
                        }}
                    />
                </Box>
                <Typography component="h1" variant="h5">
                    Sign Up
                </Typography>
                <Box
                    component="form"
                    onSubmit={handleSubmit}
                    noValidate
                    sx={{ mt: 1 }}
                >
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        id="email"
                        label="Email"
                        name="email"
                        autoFocus
                        value={formData.email}
                        onChange={handleChange}
                        error={(!!errors.email)}
                        helperText={errors.email || ""}
                    />
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        id="username"
                        label="Username"
                        name="username"
                        value={formData.username}
                        onChange={handleChange}
                        error={(!!errors.username)}
                        helperText={errors.username || ""}
                    />
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        name="password"
                        label="Password"
                        type="password"
                        id="password"
                        value={formData.password}
                        onChange={handleChange}
                        error={(!!errors.password)}
                        helperText={errors.password || ""}
                    />
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        name="confirmPassword"
                        label="Confirm Password"
                        type="password"
                        id="confirmPassword"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        error={(!!errors.confirmPassword)}
                        helperText={errors.confirmPassword || ""}
                    />
                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        sx={{ mt: 3, mb: 2 }}
                    >
                        Sign Up
                    </Button>
                </Box>
                <Typography variant="body2">
                    Already have an account?{" "}
                    <Link
                        to="/login"
                        onClick={() => navigate("/login")}
                        style={{
                            textDecoration: "underline",
                            cursor: "pointer",
                        }}
                    >
                        Log in
                    </Link>
                </Typography>
            </Box>
        </Container>
    );
};

export default Register;
