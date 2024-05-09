import { Button } from "@mui/material";
import "./page404.css";
import HomeIcon from '@mui/icons-material/Home';
import logo from '../../../Assets/Images/logo.jpg';
import { useNavigate } from "react-router-dom";

function Page404(): JSX.Element {

    const navigate = useNavigate();

    return (
        <div className="page404">
            <img src={logo} />
            <h1>OOPS! PAGE NOT FOUND!</h1>
            <p>You must have picked the wrong vacation for you because i haven't been able to find the page you are looking for.</p>
            <Button
                variant="contained"
                onClick={() => { navigate("list") }}
                endIcon={<HomeIcon />}>
                Back to home
            </Button>
        </div>
    );
}

export default Page404;
