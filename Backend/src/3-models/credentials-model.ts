import joi from "joi";
import { ValidationError } from "./client-errors";

export class CredentialsModel {

    public email: string;
    public password: string;

    public constructor(user: CredentialsModel) {
        this.email = user.email;
        this.password = user.password;
    }

    private static credentialsValidationSchema = joi.object({
        email: joi.string().email().required().min(7).max(100),
        password: joi.string().required().min(4).max(50)
    });

    public validateLogin(): void {
        const result = CredentialsModel.credentialsValidationSchema.validate(this);
        if (result.error) throw new ValidationError(result.error.message);
    }

}