import { Button, ButtonGroup, TextField } from "@mui/material";
import { useForm } from "react-hook-form";
import { NavLink, useNavigate } from "react-router-dom";
import logo from "../../../Assets/Images/logo.jpg";
import CredentialsModel from "../../../Models/CredentialsModel";
import { appStore } from "../../../Redux/Store";
import { authService } from "../../../Services/AuthService";
import { notify } from "../../../Utils/Notify";
import "./Login.css";

function Login(): JSX.Element {

    const { register, handleSubmit } = useForm<CredentialsModel>();

    const navigate = useNavigate();

    async function loginUser(credentials: CredentialsModel) {
        try {
            await authService.login(credentials);
            const firstName = appStore.getState().user.firstName;
            notify.success(`Welcome Back ${firstName}!`);
            navigate("/layout");
        }
        catch (err: any) {
            notify.error(err);
        }
    }

    return (
        <div className="Login">

            <div className="loginForm">
                <img src={logo} />
                <h2>Sign in or create an account</h2>
                <div>
                    <form onSubmit={handleSubmit(loginUser)}>
                        <TextField
                            className="TextField"
                            margin="normal"
                            fullWidth
                            required
                            inputProps={
                                {
                                    minLength: 7,
                                    maxLength: 100
                                }
                            }
                            label="Email"
                            type="email"
                            {...register("email")} />
                        <TextField
                            className="TextField"
                            margin="normal"
                            fullWidth
                            required
                            label="Password"
                            type="password"
                            inputProps={
                                {
                                    minLength: 4,
                                    maxLength: 50
                                }
                            }
                            {...register("password")} />

                        <ButtonGroup className="ButtonGroup" fullWidth variant="contained">
                            <Button className="Button" type="submit">Send</Button>
                        </ButtonGroup>
                    </form>

                    <NavLink to="/register">Not registered yet?</NavLink>
                </div>
            </div>
        </div>
    );
}

export default Login;
