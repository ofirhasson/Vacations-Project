import joi from "joi";
import { ValidationError } from "./client-errors";

export class UserModel{

    public id:number;
    public firstName:string;
    public lastName:string;
    public email:string;
    public password:string;
    public role:string;

    public constructor(user:UserModel){
        this.id=user.id;
        this.firstName=user.firstName;
        this.lastName=user.lastName;
        this.email=user.email;
        this.password=user.password;
        this.role=user.role;
    }

    private static userValidationSchema=joi.object({
        id:joi.number().forbidden().min(1).integer(),
        firstName:joi.string().required().min(2).max(50),
        lastName:joi.string().required().min(2).max(100),
        email:joi.string().email().required().min(7).max(100),
        password:joi.string().required().min(4).max(50),
        role:joi.string().optional().equal("user","admin")
    });

    public validateRegister():void{
        const result=UserModel.userValidationSchema.validate(this);
        if(result.error) throw new ValidationError(result.error.message);
    }

}