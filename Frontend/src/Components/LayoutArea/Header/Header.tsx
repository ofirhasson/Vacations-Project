import { AppBar, Box, Button, Toolbar, Typography } from "@mui/material";
import "./Header.css";
import { useNavigate } from "react-router-dom";
import { authService } from "../../../Services/AuthService";
import logo from "../../../Assets/Images/logo.jpg"
import { useSelector } from "react-redux";
import { AppState } from "../../../Redux/AppState";

function Header(): JSX.Element {

    const pages = ['Add Vacation', 'Reports'];

    const user = useSelector((appState: AppState) => appState.user);

    const navigate = useNavigate();

    function logout() {
        authService.logout();
        navigate("/login");
    }

    //handle the navigation from the navbar 
    function handleNavigate(event: React.MouseEvent<HTMLButtonElement>) {
        const key = event.currentTarget.getAttribute('data-key');
        if (key === "Add Vacation")
            navigate("new")
        if (key === "Reports")
            navigate("reports")
    }

    return (
        <div className="Header">
            <AppBar position="static">
                <Toolbar disableGutters>
                    <Box sx={{ mr: 2 }}>
                        <Button className="logoButton" onClick={() => { navigate("list") }}>
                            <img className="logoImage" src={logo} />
                        </Button>
                    </Box>
                    {user?.role === "admin" &&
                        <Box sx={{ flexGrow: 1, display: 'flex' }}>
                            {pages.map((page) => (
                                <Button
                                    key={page}
                                    data-key={page}
                                    onClick={handleNavigate}
                                    sx={{ my: 2, color: 'white', display: 'block' }}
                                >
                                    {page}
                                </Button>
                            ))}
                        </Box>}
                    <Box sx={{ marginLeft: 'auto' }}>
                        <span>Hello {user?.firstName} {user?.lastName} |</span>
                        <Button color="inherit" onClick={logout}>
                            <Typography variant="h6" component="div">
                                Logout
                            </Typography>
                        </Button>
                    </Box>
                </Toolbar>

            </AppBar>
        </div>
    );
}

export default Header;
