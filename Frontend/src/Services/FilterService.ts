import { appStore } from "../Redux/Store";
import { filterActionCreators } from "../Redux/FilterSlice";
import FilterModel from "../Models/FilterModel";

class FilterService {

    public async initialFilter(filter:FilterModel): Promise<void> {
        appStore.dispatch(filterActionCreators.initialFilter(filter));
    }
    public async setLikedVacationsFilter(likedVacationsFilter: boolean): Promise<void> {
        appStore.dispatch(filterActionCreators.setLikedVacationsFilter(likedVacationsFilter));
    }
    public async setNotStartedVacationsFilter(notStartedVacationsFilter: boolean): Promise<void> {
        appStore.dispatch(filterActionCreators.setNotStartedVacationsFilter(notStartedVacationsFilter));
    }
    public async setActiveVacationsFilter(activeVacationsFilter: boolean): Promise<void> {
        appStore.dispatch(filterActionCreators.setActiveVacationsFilter(activeVacationsFilter));
    }
    public async setPriceFilter(priceFilter: number[]): Promise<void> {
        appStore.dispatch(filterActionCreators.setPriceFilter(priceFilter));
    }
    public async setSearchFilter(searchFilter: string): Promise<void> {
        appStore.dispatch(filterActionCreators.setSearchFilter(searchFilter));
    }
    public async setStartDateFilter(startDateFilter: string): Promise<void> {
        appStore.dispatch(filterActionCreators.setStartDateFilter(startDateFilter));
    }
    public async setEndDateFilter(endDateFilter: string): Promise<void> {
        appStore.dispatch(filterActionCreators.setEndDateFilter(endDateFilter));
    }

}

export const filterService = new FilterService();