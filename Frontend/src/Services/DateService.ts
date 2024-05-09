
class DateService {

    public showDate(date: string): string {
        if(!date)
            return;
        date = date.substring(0,10);

        const year = date.substring(0, 4);
        const month = date.substring(5, 7);
        const day = date.substring(8, 10);

        return day + "/" + month + "/" + year;
    }
}

export const dateService = new DateService();