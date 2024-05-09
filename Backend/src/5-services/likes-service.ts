import { dal } from "../2-utils/dal";

class LikesService {

    //add new like:
    public async addLike(userId: number, vacationId: number): Promise<void> {
        const sql = `INSERT INTO likes(userId,vacationId) VALUES(?,?)`;
        await dal.execute(sql, [userId, vacationId]);
    }

    //delete like:
    public async deleteLike(userId: number, vacationId: number): Promise<void> {
        const sql = `DELETE FROM likes WHERE userId=? AND vacationId=? `;
        await dal.execute(sql, [userId, vacationId]);
    }

}

export const likesService = new LikesService();