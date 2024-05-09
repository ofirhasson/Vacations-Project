import { UserModel } from "../3-models/user-model";
import jwt, { SignOptions } from "jsonwebtoken";
import { appConfig } from "./app-config";
import crypto from "crypto";

class Cyber {

    // get the user token:
    public getNewToken(user: UserModel): string {
        delete user.password;
        const container = { user };
        const options: SignOptions = { expiresIn: "5h" };
        const token = jwt.sign(container, appConfig.jwtSecretKey, options);
        return token;
    }

    // Check if token is valid:
    public isTokenValid(token: string): boolean {
        try {
            if (!token) return false;
            jwt.verify(token, appConfig.jwtSecretKey);
            return true;
        }
        catch (err: any) {
            return false;
        }
    }

    // Check if user is admin:
    public isAdmin(token: string): boolean {
        const container = jwt.decode(token) as { user: UserModel };
        const user = container.user;
        return user.role === "admin";
    }

    // Hash password:
    public hashPassword(plainText: string): string {
        const hashedPassword = crypto.createHmac("sha512", appConfig.passwordSalt).update(plainText).digest("hex");
        return hashedPassword;
    }


}

export const cyber = new Cyber();
