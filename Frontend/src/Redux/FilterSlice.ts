import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import FilterModel from "../Models/FilterModel";

//reducer for initial filter
function initialFilter(currentState: FilterModel, action: PayloadAction<FilterModel>): FilterModel {
    const newState = action.payload;
    return newState;
}

//reducer for setting the liked vacations
function setLikedVacationsFilter(currentState: FilterModel, action: PayloadAction<boolean>): FilterModel {
    const newState = currentState;
    newState.likedVacations = action.payload;
    return newState;
}

//reducer for setting the future vacations
function setNotStartedVacationsFilter(currentState: FilterModel, action: PayloadAction<boolean>): FilterModel {
    const newState = currentState;
    newState.notStartedVacations = action.payload;
    return newState;
}

//reducer for setting the active vacations
function setActiveVacationsFilter(currentState: FilterModel, action: PayloadAction<boolean>): FilterModel {
    const newState = currentState;
    newState.activeVacations = action.payload;
    return newState;
}

//reducer for setting the prices
function setPriceFilter(currentState: FilterModel, action: PayloadAction<number[]>): FilterModel {
    const newState = currentState;
    newState.price = action.payload;
    return newState;
}

//reducer for setting the name search
function setSearchFilter(currentState: FilterModel, action: PayloadAction<string>): FilterModel {
    const newState = currentState;
    newState.search = action.payload;
    return newState;
}

//reducer for setting the start date
function setStartDateFilter(currentState: FilterModel, action: PayloadAction<string>): FilterModel {
    const newState = currentState;
    newState.startDate = action.payload;
    return newState;
}

//reducer for setting the end date
function setEndDateFilter(currentState: FilterModel, action: PayloadAction<string>): FilterModel {
    const newState = currentState;
    newState.endDate = action.payload;
    return newState;
}

const filterSlice = createSlice({
    name: "filter",
    initialState: null,
    reducers: { setActiveVacationsFilter, setLikedVacationsFilter, setNotStartedVacationsFilter, setPriceFilter, setSearchFilter,setStartDateFilter,setEndDateFilter, initialFilter }
});

export const filterActionCreators = filterSlice.actions;
export const filterReducersContainer = filterSlice.reducer;

