import { configureStore } from "@reduxjs/toolkit";
import { AppState } from "./AppState";
import { authReducersContainer } from "./AuthSlice";
import { vacationReducersContainer } from "./VacationsSlice";
import { filterReducersContainer } from "./FilterSlice";

//Creating the application store - the redux manager object:
export const appStore=configureStore<AppState>({
    reducer:{
        vacations:vacationReducersContainer,
        user:authReducersContainer,
        filter:filterReducersContainer
    }
});
