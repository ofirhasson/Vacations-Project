import { OkPacketParams } from "mysql2";
import { UserModel } from "../3-models/user-model";
import { dal } from "../2-utils/dal";
import { cyber } from "../2-utils/cyber";
import { CredentialsModel } from "../3-models/credentials-model";
import { UnauthorizedError, ValidationError } from "../3-models/client-errors";

class AuthService {

    //register new user:
    public async register(user: UserModel): Promise<string> {

        user.validateRegister();
        if (await this.isEmailTaken(user.email)) throw new ValidationError("email is already been taken.");

        //init role as regular user
        if (!user.role) user.role = "user";
        user.password = cyber.hashPassword(user.password);
        const sql = "INSERT INTO users(firstName,lastName,email,password,role) VALUES(?,?,?,?,?)";
        const info: OkPacketParams = await dal.execute(sql, [user.firstName, user.lastName, user.email, user.password, user.role]);
        user.id = info.insertId;
        const token: string = cyber.getNewToken(user);
        return token;
    }

    //login user
    public async login(credentials: CredentialsModel): Promise<string> {

        credentials.validateLogin();
        credentials.password = cyber.hashPassword(credentials.password);
        const sql = "SELECT * FROM users WHERE email = ? AND password = ?";
        const users = await dal.execute(sql, [credentials.email, credentials.password]);
        const user = users[0];
        if (!user) throw new UnauthorizedError("Incorrect email or password.");
        const token: string = cyber.getNewToken(user);
        return token;
    }

    //check if email is taken
    private async isEmailTaken(email: string): Promise<boolean> {

        const sql = `SELECT EXISTS(SELECT * FROM users WHERE email=?) AS isTaken`;
        const result = await dal.execute(sql, [email]);
        const isTaken = result[0].isTaken;
        return isTaken === 1;
    }
}
export const authService = new AuthService();