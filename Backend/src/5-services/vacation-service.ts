import { dal } from "../2-utils/dal";
import { OkPacketParams } from "mysql2";
import { VacationModel } from "../3-models/vacation-model";
import { appConfig } from "../2-utils/app-config";
import { ResourceNotFoundError } from "../3-models/client-errors";
import { fileSaver } from "uploaded-file-saver";

interface VacationFilter {
    minPrice?: number;
    maxPrice?: number;
    startDate?: string;
    endDate?: string;
    search?: string;
    isLikedVacations?: string;
    isActiveVacations?: string;
    isFutureVacations?: string;
    page?: number;
    vacationsInPage?: number;
}

class VacationService {

    //get all filtered vacations with user likes
    public async getAllFilteredVacations(userId: number, filter?: VacationFilter): Promise<{ vacations: VacationModel[], totalRows: number }> {
        //check if filter attributes exists - if not reset with initial value
        if (!filter.minPrice)
            filter.minPrice = 0;
        if (!filter.maxPrice)
            filter.maxPrice = 10000;
        if (!filter.startDate)
            filter.startDate = "0000-01-01";
        if (!filter.endDate)
            filter.endDate = "9999-12-31";
        if (!filter.search)
            filter.search = "";
        if (!filter.page)
            filter.page = 0;
        if (!filter.vacationsInPage)
            filter.vacationsInPage = 1844674407370955;

        //check if filter attributes exists - if not reset with initial value
        //also convert the string to boolean
        let isLikedVacations: boolean;
        filter.isLikedVacations === "true" ? isLikedVacations = true : isLikedVacations = false;

        let isActiveVacations: boolean;
        filter.isActiveVacations === "true" ? isActiveVacations = true : isActiveVacations = false;

        let isFutureVacations: boolean;
        filter.isFutureVacations === "true" ? isFutureVacations = true : isFutureVacations = false;

        //calculate offset for limit
        let offset: number = 0;
        if (filter.page >= 1)
            offset = (filter.page - 1) * filter.vacationsInPage;

        //get the date of today
        const now = new Date();
        const year = now.getFullYear();
        const month = String(now.getMonth() + 1).padStart(2, '0');
        const day = String(now.getDate()).padStart(2, '0');
        const nowDate = `${year}-${month}-${day}`;

        //testing to the active vacations
        let sqlActiveVacations: string = "";
        if (isActiveVacations)
            //put AND to return only the active vacations
            sqlActiveVacations = `AND (startDate <= '${nowDate}' AND endDate >= '${nowDate}')`

        //testing to the future vacations
        let sqlFutureVacations: string = "";
        if (isFutureVacations)
            //put AND to return only the future vacations
            sqlFutureVacations = `AND (startDate > '${nowDate}')`

        //if both future and active vacations turned on do OR between them
        if (isFutureVacations && isActiveVacations) {
            sqlActiveVacations = `AND ((startDate <= '${nowDate}' AND endDate >= '${nowDate}')`;
            sqlFutureVacations = `OR (startDate > '${nowDate}'))`;
        }

        //testing to the liked vacations
        let sqlLikedVacations: string = "";
        if (isLikedVacations)
            // //put AND to return only the liked vacations
            sqlLikedVacations = `AND (EXISTS(SELECT * FROM likes WHERE vacationId = V.id AND userId = ${userId}))`

        //building query to return filtered vacations
        const sql = `
        SELECT DISTINCT
        V.*,
        EXISTS(SELECT * FROM likes WHERE vacationId = V.id AND userId = ?) AS isLiked,
        COUNT(L.userId) AS likesCount
        ,CONCAT(?,imageName) as imageUrl 
        FROM vacations as V LEFT JOIN likes as L
        ON V.id = L.vacationId
        WHERE price >= ? AND price <= ? AND (startDate >= ? AND endDate <= ?) ${sqlActiveVacations} ${sqlFutureVacations} AND destination like ? ${sqlLikedVacations}
        GROUP BY id
        ORDER BY startDate LIMIT ?,?`;

        //building query to return total rows of the filtered vacations
        const totalRowsSql = `
        SELECT COUNT(*) AS totalRows
        FROM vacations as V
        WHERE price >= ? AND price <= ? AND (startDate >= ? AND endDate <= ?) ${sqlActiveVacations} ${sqlFutureVacations} AND destination like ? ${sqlLikedVacations}`;

        const [vacations, totalRowsResult] = await Promise.all([
            dal.execute(sql, [userId, appConfig.baseImageUrl, +filter.minPrice, +filter.maxPrice, filter.startDate, filter.endDate, `%${filter.search}%`, offset, +filter.vacationsInPage]),
            dal.execute(totalRowsSql, [+filter.minPrice, +filter.maxPrice, filter.startDate, filter.endDate, `%${filter.search}%`])
        ]);
        const totalRows = totalRowsResult[0]?.totalRows || 0;
        //return both vacations and total rows.
        return { vacations, totalRows };
    }

    //get one vacation
    public async getOneVacation(id: number): Promise<VacationModel> {
        const sql = `SELECT *,CONCAT(?,imageName) as imageUrl FROM vacations WHERE id=?`;
        const vacations = await dal.execute(sql, [appConfig.baseImageUrl, id]);
        const vacation = vacations[0];
        if (!vacation) throw new ResourceNotFoundError(id);
        return vacation;
    }

    //add new vacation
    public async addVacation(vacation: VacationModel): Promise<VacationModel> {
        vacation.validateInsert();
        const imageName = await fileSaver.add(vacation.image);
        const sql = `INSERT INTO vacations(destination,description,startDate,endDate,price,imageName) VALUES(?,?,?,?,?,?)`;
        const info: OkPacketParams = await dal.execute(sql, [vacation.destination, vacation.description, vacation.startDate, vacation.endDate, vacation.price, imageName]);
        vacation = await this.getOneVacation(info.insertId);
        return vacation;
    }

    //update full vacation
    public async updateVacation(vacation: VacationModel): Promise<VacationModel> {
        vacation.validateUpdate();
        const oldImageName = await this.getImageName(vacation.id);
        const newImageName = vacation.image ? await fileSaver.update(oldImageName, vacation.image) : oldImageName;
        const sql = `UPDATE vacations SET 
            destination = ? ,
            description = ? ,
            startDate = ? ,
            endDate = ? ,
            price = ? ,
            imageName = ?
            WHERE id = ? `;

        const info: OkPacketParams = await dal.execute(sql, [vacation.destination, vacation.description, vacation.startDate, vacation.endDate, vacation.price, newImageName, vacation.id]);
        if (info.affectedRows === 0) throw new ResourceNotFoundError(vacation.id);
        vacation = await this.getOneVacation(vacation.id);
        return vacation;
    }

    //Delete vacation
    public async deleteVacation(id: number): Promise<void> {
        const oldImageName = await this.getImageName(id);
        const sql = `DELETE FROM vacations WHERE id=?`;
        const info: OkPacketParams = await dal.execute(sql, [id]);
        if (info.affectedRows === 0) throw new ResourceNotFoundError(id);
        await fileSaver.delete(oldImageName);
    }

    //get image name from database:
    private async getImageName(id: number): Promise<string> {
        const sql = `SELECT imageName FROM vacations WHERE id=?`;
        const vacations = await dal.execute(sql, [id]);
        const vacation = vacations[0];
        if (!vacation) return null;
        const imageName = vacation.imageName;
        return imageName;
    }

}

export const vacationsService = new VacationService();
