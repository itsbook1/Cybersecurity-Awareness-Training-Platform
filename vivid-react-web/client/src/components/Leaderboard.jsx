// src/pages/Leaderboard.js
import React, { useEffect, useState } from 'react';
import {
    Box,
    Typography,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    TextField,
    MenuItem,
    IconButton,
} from '@mui/material';
import SortIcon from '@mui/icons-material/Sort';
import axios from 'axios';

const Leaderboard = () => {
    const [data, setData] = useState([]);
    const [sortOrder, setSortOrder] = useState('asc'); // Default sort order
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get('http://127.0.0.1:5000/api/leaderboard'); // Update the endpoint as needed
                setData(response.data);
            } catch (error) {
                console.error("Error fetching leaderboard data:", error);
            }
        };

        fetchData();
    }, []);

    // Handle sorting
    const handleSort = () => {
        const sortedData = [...data].sort((a, b) => {
            if (sortOrder === 'asc') {
                return a.score - b.score; // Ascending order
            }
            return b.score - a.score; // Descending order
        });
        setData(sortedData);
        setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc'); // Toggle sort order
    };

    // Filter data based on search term
    const filteredData = data.filter(item =>
        item.username.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <Box sx={{ padding: 4 }}>
            <Typography variant="h4" gutterBottom>
                Leaderboard
            </Typography>
            <TextField
                label="Search User"
                variant="outlined"
                fullWidth
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                sx={{ mb: 2 }} // Margin bottom
            />
            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>
                                <IconButton onClick={handleSort}>
                                    <SortIcon />
                                </IconButton>
                                Rank
                            </TableCell>
                            <TableCell>User</TableCell>
                            <TableCell>Score</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {filteredData.length > 0 ? (
                            filteredData.map((item, index) => (
                                <TableRow key={item.id}>
                                    <TableCell>{index + 1}</TableCell>
                                    <TableCell>{item.username}</TableCell>
                                    <TableCell
                                        sx={{
                                            fontWeight: item.score >= 100 ? 'bold' : 'normal', // Highlight scores
                                            color: item.score >= 100 ? 'green' : 'black', // Change color for high scores
                                        }}
                                    >
                                        {item.score}
                                    </TableCell>
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={3} align="center">No results found.</TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </TableContainer>
        </Box>
    );
};

export default Leaderboard;
//Leadboard can filter and search through users