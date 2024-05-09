import axios from "axios";
import UserModel from "../Models/UserModel";
import { appConfig } from "../Utils/AppConfig";
import { jwtDecode } from "jwt-decode";
import { appStore } from "../Redux/Store";
import { authActionCreators } from "../Redux/AuthSlice";
import CredentialsModel from "../Models/CredentialsModel";

class AuthService {

    private timerId: any;

    //keep the user in session storage logged in
    public constructor() {
        const token = sessionStorage.getItem("token");
        if (token) {
            const loggedInUser = jwtDecode<{ user: UserModel }>(token).user;
            appStore.dispatch(authActionCreators.login(loggedInUser));
        }
    }

    //Register a new User;
    public async register(user: UserModel): Promise<void> {

        const response = await axios.post<string>(appConfig.registerUrl, user);
        const token = response.data;
        const registeredUser = jwtDecode<{ user: UserModel }>(token).user;
        appStore.dispatch(authActionCreators.register(registeredUser));
        sessionStorage.setItem("token", token);

        //after 5 hours logging out automatically
        this.timerId = setTimeout(() => {
            this.logout();
        }, 18000000);

    }

    //Login existing User;
    public async login(credentials: CredentialsModel): Promise<void> {
        console.log(appConfig.loginUrl);
        
        const response = await axios.post<string>(appConfig.loginUrl, credentials);
        const token = response.data;
        const loggedInUser = jwtDecode<{ user: UserModel }>(token).user;
        appStore.dispatch(authActionCreators.login(loggedInUser));
        sessionStorage.setItem("token", token);

        //after 5 hours logging out automatically
        this.timerId = setTimeout(() => {
            this.logout();
        }, 18000000);

    }

    public logout(): void {
        appStore.dispatch(authActionCreators.logout());
        sessionStorage.clear();
        clearTimeout(this.timerId);
    }


}

export const authService = new AuthService();