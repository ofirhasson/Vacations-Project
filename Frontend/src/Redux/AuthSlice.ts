import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import UserModel from "../Models/UserModel";

//reducer for register new user:
function register(currentState: UserModel, action: PayloadAction<UserModel>): UserModel {
    const registeredUser=action.payload;
    const newState=registeredUser;
    return newState;
}

//reducer for login existing user:
function login(currentState: UserModel, action: PayloadAction<UserModel>): UserModel {
    const loggedInUser=action.payload;
    const newState=loggedInUser;
    return newState;
}

//reducer for logout existing user:
function logout(currentState: UserModel, action: PayloadAction<UserModel>): UserModel {
    return null;
}

const authSlice=createSlice({
    name:"auth",
    initialState:null,
    reducers:{register,login,logout}
});

export const authActionCreators=authSlice.actions;
export const authReducersContainer=authSlice.reducer;

