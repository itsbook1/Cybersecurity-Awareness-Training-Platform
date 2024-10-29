import { useState, useContext } from "react";
import { useMutation } from "@tanstack/react-query";
import AuthContext from "../AuthContext";
import axios from "axios";
import {
    Button,
    TextField,
    Checkbox,
    FormControlLabel,
    Box,
    Container,
    Typography,
    CssBaseline,
} from "@mui/material";
import { useNavigate } from "react-router-dom";

const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [remember, setRemember] = useState(false);
    const { login } = useContext(AuthContext);
    const [errors, setErrors] = useState({});
    const navigate = useNavigate();

   const mutation = useMutation({
        mutationFn: async ({ email, password, remember }) => {
            const response = await axios.post("http://localhost:5000/login", {
                email,
                password,
                remember,
            });
            return response.data;
        },
        onSuccess: (data) => {
            login(data.user, data.access_token);
            navigate("/dashboard")
        },
        onError: (error) => {
            alert("Login failed: " + error.message);
        },
    });

    const validateForm = () => {
        let formErrors = {};

        if (!email) {
            formErrors.email = "Please enter an email.";
        }
        if (!password) {
            formErrors.password = "Please enter a password.";
        }

        setErrors(formErrors);

        return Object.keys(formErrors).length == 0;
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (validateForm()) {
        mutation.mutate({ email, password, remember });
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
                <Box m={5}>
                    <img
                        src={
                            "../vivid.png"
                        }
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
                    Login
                </Typography>
                <Box
                    component="form"
                    onSubmit={handleSubmit}
                    noValidate
                    sx={{ mt: 1 }}
                >
                    <TextField
                        variant="outlined"
                        margin="normal"
                        required
                        fullWidth
                        id="email"
                        label="Email Address"
                        name="email"
                        autoComplete="email"
                        autoFocus
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        error={(!!errors.email)}
                        helperText={errors.email || ""}
                    />
                    <TextField
                        variant="outlined"
                        margin="normal"
                        required
                        fullWidth
                        name="password"
                        label="Password"
                        type="password"
                        id="password"
                        autoComplete="current-password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        error={(!!errors.password)}
                        helperText={errors.password || ""}
                    />
                    <FormControlLabel
                        control={
                            <Checkbox
                                value={remember}
                                color="primary"
                                checked={remember}
                                onChange={(e) => setRemember(e.target.checked)}
                            />
                        }
                        label="Remember me"
                    />
                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        sx={{ mt: 3, mb: 2 }}
                    >
                        Log In
                    </Button>
                    <Button
                        type="button"
                        fullWidth
                        variant="contained"
                        onClick={() => navigate("/register")}
                    >
                        Create Account
                    </Button>
                </Box>
            </Box>
        </Container>
    );
};

export default Login;
