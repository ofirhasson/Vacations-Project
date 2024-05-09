import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import VacationModel from "../Models/VacationModel";

//Reducer for adding all vacations to the global state:
function initAll(currentState: VacationModel[], action: PayloadAction<VacationModel[]>): VacationModel[] {
    const newState = action.payload;
    return newState;
}

//Reducer for adding vacation to the slice:
function addOne(currentState: VacationModel[], action: PayloadAction<VacationModel>): VacationModel[] {
    const newState = [...currentState, action.payload];
    return newState;
}

//Reducer for updating vacation to the slice:
function updateOne(currentState: VacationModel[], action: PayloadAction<VacationModel>): VacationModel[] {
    const newState = [...currentState];
    const index = newState.findIndex(v => v.id === action.payload.id);
    if (index >= 0)
        newState[index] = action.payload;
    return newState;
}

//Reducer for deleting vacation to the slice:
function deleteOne(currentState: VacationModel[], action: PayloadAction<number>): VacationModel[] {
    const newState = [...currentState];
    const index = newState.findIndex(v => v.id === action.payload);
    if (index >= 0)
        newState.splice(index, 1);
    return newState;
}

//create the products slice - containing and managing only the products array:
const vacationsSlice = createSlice({
    name: "vacations",
    initialState: [],
    reducers: { initAll, addOne, updateOne, deleteOne }
});

export const vacationActionCreators = vacationsSlice.actions;
export const vacationReducersContainer = vacationsSlice.reducer;