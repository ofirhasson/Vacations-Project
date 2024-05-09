import DeleteIcon from '@mui/icons-material/Delete';
import SendIcon from '@mui/icons-material/Send';
import { Button, Stack, TextField } from "@mui/material";
import { useForm } from "react-hook-form";
import { NavLink, useNavigate } from "react-router-dom";
import logo from "../../../Assets/Images/logo.jpg";
import UserModel from "../../../Models/UserModel";
import { appStore } from "../../../Redux/Store";
import { authService } from "../../../Services/AuthService";
import { notify } from "../../../Utils/Notify";
import "./Register.css";

function Register(): JSX.Element {
    const { register, handleSubmit } = useForm<UserModel>();

    const navigate = useNavigate();

    async function registerUser(user: UserModel) {
        try {
            await authService.register(user);
            const firstName = appStore.getState().user.firstName;
            notify.success(`Hello ${firstName}!`);
            navigate("/layout");
        }
        catch (err: any) {
            notify.error(err);
        }
    }

    return (
        <div className="Register">
            <div className="registerForm">
                <img src={logo} />
                <h2>Register</h2>
                <div>
                    <form onSubmit={handleSubmit(registerUser)}>
                        <TextField
                            className="TextField"
                            margin="normal"
                            fullWidth
                            required
                            inputProps={
                                {
                                    minLength: 2,
                                    maxLength: 50
                                }
                            }

                            label="First Name"
                            type="text"
                            {...register("firstName")} />
                        <TextField
                            className="TextField"
                            margin="normal"
                            fullWidth
                            required
                            inputProps={
                                {
                                    minLength: 2,
                                    maxLength: 100
                                }
                            }
                            label="Last Name"
                            type="text"
                            {...register("lastName")} />
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

                        <Stack margin={2} direction="row" justifyContent={"center"} spacing={4}>
                            <Button variant="contained" endIcon={<SendIcon />} type="submit">
                                Register
                            </Button>
                            <Button variant="outlined" startIcon={<DeleteIcon />} type="reset">
                                Clear
                            </Button>
                        </Stack>

                    </form>
                    <NavLink to="/login">Already a member?</NavLink>
                </div>
            </div>
            <div className="Overlay"></div>

        </div>
    );
}

export default Register;
