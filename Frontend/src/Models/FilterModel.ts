
class FilterModel {
    public likedVacations: boolean = false;
    public activeVacations: boolean = false;
    public notStartedVacations: boolean = false;
    public price: number[] = [0, 10000];
    public search: string = "";
    public startDate: string = "";
    public endDate: string = "";
}

export default FilterModel;
