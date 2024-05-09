import axios from "axios";
import VacationModel from "../Models/VacationModel";
import { appStore } from "../Redux/Store";
import { vacationActionCreators } from "../Redux/VacationsSlice";
import { appConfig } from "../Utils/AppConfig";

interface VacationFilter {
    minPrice?: number;
    maxPrice?: number;
    startDate?: string;
    endDate?: string;
    search?: string;
    isLikedVacations?: boolean;
    isActiveVacations?: boolean;
    isFutureVacations?: boolean;
    page?: number;
    vacationsInPage?: number;
}

interface VacationsAndTotalRows {
    vacations?: VacationModel[];
    totalRows?: number;
}

class VacationService {

    //init all vacations
    public async initAllVacations(): Promise<void> {
        const response = await axios.get<VacationModel[]>(appConfig.vacationsUrl + appStore.getState().user?.id);
        const vacationsAndTotalRows = response.data as VacationsAndTotalRows;
        
        const action = vacationActionCreators.initAll(vacationsAndTotalRows.vacations);
        appStore.dispatch(action);
    }

    //get all vacations
    public async getAllVacations(filter?: VacationFilter): Promise<VacationsAndTotalRows> {
        const response = await axios.get<VacationModel[]>(appConfig.vacationsUrl + appStore.getState().user?.id, { params: filter });
        const vacationsAndTotalRows = response.data as VacationsAndTotalRows;
        return vacationsAndTotalRows;
    }

    //get one vacation by id
    public async getOneVacation(id: number): Promise<VacationModel> {
        let vacations = appStore.getState().vacations;
        let vacation = vacations.find(p => p.id === id);
        if (vacation) return vacation;

        const response = await axios.get<VacationModel>(appConfig.vacationUrl + id);
        vacation = response.data;
        return vacation;
    }

    //add one vacation
    public async addVacation(vacation: VacationModel): Promise<void> {
        const response = await axios.post<VacationModel>(appConfig.vacationsUrl, vacation, appConfig.axiosOptions);
        const addedVacation = response.data;

        const action = vacationActionCreators.addOne(addedVacation);
        appStore.dispatch(action);

    }

    //update one vacation
    public async updateVacation(vacation: VacationModel): Promise<void> {
        const response = await axios.put<VacationModel>(appConfig.vacationsUrl + vacation.id, vacation, appConfig.axiosOptions);
        const updatedVacation = response.data;

        const action = vacationActionCreators.updateOne(updatedVacation);
        appStore.dispatch(action);
    }

    //delete one vacation
    public async deleteVacation(id: number): Promise<void> {
        await axios.delete(appConfig.vacationsUrl + id);

        const action = vacationActionCreators.deleteOne(id);
        appStore.dispatch(action);
    }

    //add like to database and init all vacations
    public async addLike(vacationId: number): Promise<void> {
        await axios.post(appConfig.likesUrl + "user/" + appStore.getState().user.id + "/vacation/" + vacationId);
        await this.initAllVacations();
    }

    //remove like from database and init all vacations
    public async removeLike(vacationId: number): Promise<void> {
        await axios.delete(appConfig.likesUrl + "user/" + appStore.getState().user.id + "/vacation/" + vacationId);
        await this.initAllVacations();
    }
}

export const vacationService = new VacationService();
