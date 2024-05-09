import UserModel from "../Models/UserModel";
import VacationModel from "../Models/VacationModel";
import FilterModel from "../Models/FilterModel";

export type AppState = {
    vacations: VacationModel[];
    user: UserModel;
    filter: FilterModel;
};