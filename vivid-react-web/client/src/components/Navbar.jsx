import React from 'react';
import { Box, 
    AppBar, 
    Toolbar, 
    IconButton, 
    Drawer, 
    List, 
    ListItem, 
    ListItemButton, 
    ListItemText, 
    Divider 
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import { useNavigate, useLocation } from 'react-router-dom';
import AuthContext from "../AuthContext";

const drawerWidth = 240; 

const Navbar = () => {
    const { user, logout } = React.useContext(AuthContext);
    const navigate = useNavigate();
    const [drawerOpen, setDrawerOpen] = React.useState(false); 

    const handleDrawerOpen = () => {
        setDrawerOpen(true);
    };

    const handleDrawerClose = () => {
        setDrawerOpen(false);
    };

    const getPageName = () => {
        switch (location.pathname) {
            case "/dashboard":
                return "Dashboard";
            case "/leaderboard":
                return "Leaderboard";
            case "/admin":
                return "Admin Panel"
        }

    };

    const DrawerList = (
        <Box sx={{ width: drawerWidth }} role="presentation">
            <List>
                <ListItem disablePadding>
                    <ListItemButton onClick={() => navigate("/dashboard")}>
                        <ListItemText primary="Dashboard" />
                    </ListItemButton>
                </ListItem>
                <ListItem disablePadding>
                    <ListItemButton onClick={() => navigate("/leaderboard")}>
                        <ListItemText primary="Leaderboard" />
                    </ListItemButton>
                </ListItem>
                <ListItem disablePadding>
                    <ListItemButton onClick={() => navigate("/admin")}>
                        <ListItemText primary="Admin Panel" />
                    </ListItemButton>
                </ListItem>
            </List>
            <Divider />
            <List>
                <ListItem disablePadding>
                    <ListItemButton
                        onClick={() => {
                            logout();
                            navigate("/login");
                        }}
                    >
                        <ListItemText primary="Logout" />
                    </ListItemButton>
                </ListItem>
            </List>
        </Box>
    );

    return (
        <Box sx={{ display: 'flex' }}>
            <AppBar
                position="fixed"
                color="Black"
                sx={{
                    width: `calc(100% - ${drawerOpen ? drawerWidth : 0}px)`,
                    ml: `${drawerOpen ? drawerWidth : 0}px`,
                    transition: 'width 0.3s ease',
                }}
            >
                <Toolbar>
                    {!drawerOpen && (
                        <IconButton
                            color="inherit"
                            aria-label="open drawer"
                            onClick={handleDrawerOpen}
                            edge="start"
                            sx={{ mr: 2 }}
                        >
                            <MenuIcon />
                        </IconButton>
                    )}
                    <div style={{ color: 'white', fontSize: '20px' }}>
                        <div>{user ? `Welcome, ${user.username}` : "Welcome, Guest"}</div>
                        <div style={{ 
                            color: 'white', 
                            fontSize: '20px', 
                            position: 'absolute', 
                            left: '50%', 
                            transform: 'translateX(-50%)', 
                            marginTop: '-30px' }}>{getPageName()}</div>
                    </div>
                </Toolbar>
            </AppBar>
            <Drawer
                sx={{
                    width: drawerWidth,
                    flexShrink: 0,
                    '& .MuiDrawer-paper': {
                        width: drawerWidth,
                        boxSizing: 'border-box',
                    },
                }}
                variant="persistent"
                anchor="left"
                open={drawerOpen}
            >
                <Box sx={{ display: 'flex', alignItems: 'center', padding: '0 8px', justifyContent: 'flex-end' }}>
                <img
                src="../vivid2.png"
                width={100}
                height={50}
                style={{
                    position: 'relative',
                    right: '30px'
                }}
                ></img>
                    <IconButton onClick={handleDrawerClose}>
                        <ChevronLeftIcon />
                    </IconButton>
                </Box>
                {DrawerList}
            </Drawer>
        </Box>
    );
};

export default Navbar;