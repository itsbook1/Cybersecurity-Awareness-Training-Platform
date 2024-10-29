import { useContext, useEffect, useState } from "react";
import {
    BrowserRouter as Router,
    Route,
    Routes,
    Navigate,
} from "react-router-dom";
import AuthContext from "./AuthContext";
import Login from "./components/Login";
import Register from "./components/Register";
import Admin from "./components/Admin";
import Navbar from "./components/Navbar.jsx";
import { Box, CssBaseline, ThemeProvider, createTheme, Switch, FormControlLabel } from '@mui/material';
import UserDashboard from "./components/UserDashboard.jsx";
import Leaderboard from "./components/Leaderboard"; // Import the Leaderboard component

const App = () => {
    const { user, loading } = useContext(AuthContext);
    const [darkMode, setDarkMode] = useState(false);

    // Create a theme based on the darkMode state
    const theme = createTheme({
        palette: {
            mode: darkMode ? 'dark' : 'light',
        },
    });

    // Toggle dark mode and store preference in localStorage
    const toggleDarkMode = () => {
        setDarkMode((prevMode) => {
            const newMode = !prevMode;
            localStorage.setItem('darkMode', newMode); // Store in localStorage
            return newMode;
        });
    };

    // Load dark mode preference from localStorage on initial render
    useEffect(() => {
        const storedMode = localStorage.getItem('darkMode');
        if (storedMode) {
            setDarkMode(JSON.parse(storedMode));
        }
    }, []);

    if (loading) {
        return (
            <div>
                <h2>Loading...</h2>
            </div>
        );
    }

    return (
        <ThemeProvider theme={theme}>
            <CssBaseline /> {/* Apply global styles based on the theme */}
            <div className="App">
                <Router>
                    {user ? (
                        <>
                            <Navbar />
                            {/* Add Switch in top right corner */}
                            <Box 
                                sx={{ 
                                    position: 'fixed', // Fixed positioning to keep it in view
                                    top: 16, 
                                    right: 16, 
                                    zIndex: 1300, // Ensure it's on top of other elements
                                    backgroundColor: 'transparent', // Transparent background to avoid overlaps
                                }}
                            >
                                <FormControlLabel
                                    control={<Switch checked={darkMode} onChange={toggleDarkMode} />}
                                    label={darkMode ? 'Dark Mode' : 'Light Mode'}
                                />
                            </Box>
                            <Box
                                component="main"
                                sx={{
                                    flexGrow: 1,
                                    p: 3,
                                    marginTop: '64px',
                                }}
                            >
                                <Routes>
                                    <Route path="/dashboard" element={<UserDashboard />} />
                                    <Route path="/admin" element={<Admin />} />
                                    <Route path="/leaderboard" element={<Leaderboard />} /> {/* Add the Leaderboard route */}
                                    <Route path="/" element={<Navigate to="/dashboard" />} />
                                </Routes>
                            </Box>
                        </>
                    ) : (
                        <Routes>
                            <Route path="/login" element={<Login />} />
                            <Route path="/register" element={<Register />} />
                            <Route path="*" element={<Navigate to="/login" />} />
                        </Routes>
                    )}
                </Router>
            </div>
        </ThemeProvider>
    );
};

export default App;
