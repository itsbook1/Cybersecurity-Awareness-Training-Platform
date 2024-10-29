import { createContext, useState, useEffect } from "react";
import axios from "axios";
import PropTypes from "prop-types";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    const login = (userData, accessToken) => {
        setUser(userData);
        localStorage.setItem("token", accessToken);
        axios.defaults.headers.common[
            "Authorization"
        ] = `Bearer ${accessToken}`;
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem("token");
        delete axios.defaults.headers.common["Authorization"];
    };

    useEffect(() => {
        const getSession = async () => {
            try {
                const token = localStorage.getItem("token");
                if (token) {
                    axios.defaults.headers.common[
                        "Authorization"
                    ] = `Bearer ${token}`;
                    const response = await axios.get(
                        "http://localhost:5000/user-data"
                    );
                    if (response.status === 200) {
                        setUser(response.data);
                    }
                }
            } catch (error) {
                console.error("Failed to load user data:", error);
                setUser(null);
                localStorage.removeItem("token");
            } finally {
                setLoading(false);
            }
        };
        getSession();
    }, []);

    return (
        <AuthContext.Provider value={{ user, loading, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

AuthProvider.propTypes = {
    children: PropTypes.node.isRequired,
};

export default AuthContext;