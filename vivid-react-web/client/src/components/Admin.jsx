import React, { useState, useEffect } from "react";
import {
    Button,
    Container,
    FormControl,
    InputLabel,
    MenuItem,
    Select,
    Typography,
    Box,
} from "@mui/material";
import axios from "axios";

const Admin = () => { 
    const [users, setUsers] = useState([]);
    const [userId, setUserId] = useState("");
    const [file, setFile] = useState(null);

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await axios.get("http://127.0.0.1:5000/admin");
                setUsers(response.data);
            } catch (error) {
                console.error("Failed to fetch users:", error);
            }
        };
        fetchUsers();
    }, []);

    const handleUserChange = (event) => {
        setUserId(event.target.value);
    };

    const handleFileChange = (event) => {
        setFile(event.target.files[0]);
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        const formData = new FormData();
        formData.append("user_id", userId);
        formData.append("file", file);

        try {
            await axios.post("http://localhost:5000/admin", formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });
            alert("File uploaded successfully!");
        } catch (error) {
            alert("Failed to upload file: " + error.message);
        }
    };

    return (
        <Container component="main" maxWidth="xs">
            <Box
                sx={{
                    border: "2px solid #ccc",     
                    padding: "16px",              
                    borderRadius: "8px",         
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    mt: 2,                   
                }}
                >
            <Box
                sx={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                }}
            >
                <Typography variant="h4" gutterBottom>
                    PDF Upload
                </Typography>
                <Box
                    component="form"
                    onSubmit={handleSubmit}
                    sx={{
                        width: "100%",
                        mt: 3,
                        display: "flex",
                        flexDirection: "column",
                        gap: 3,
                    }}
                >
                    <FormControl fullWidth required>
                        <InputLabel id="user-label" variant="outlined">User</InputLabel>
                        <Select
                            labelId="user-label"
                            id="user_id"
                            value={userId}
                            onChange={handleUserChange}
                        >
                            {users.length > 0 ? (
                                users.map((user) => (
                                    <MenuItem key={user.id} value={user.id}>
                                        {user.username}
                                    </MenuItem>
                                ))
                            ) : (
                                <MenuItem disabled>No users available</MenuItem>
                            )}
                        </Select>
                    </FormControl>
                    <Box>
                        <input
                            type="file"
                            accept="application/pdf"
                            onChange={handleFileChange}
                            required
                            style={{ marginTop: '16px' }}
                        />
                    </Box>

                    <Button
                        type="submit"
                        variant="contained"
                        fullWidth
                        sx={{ mt: 3 }}
                    >
                        Upload PDF
                    </Button>
                </Box>
            </Box>
        </Box>
        </Container>
    );
};

export default Admin;