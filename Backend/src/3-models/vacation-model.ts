import Joi from "joi";
import { ValidationError } from "./client-errors";
import { UploadedFile } from "express-fileupload";

export class VacationModel {
    public id: number;
    public destination: string;
    public description: string;
    public startDate: string;
    public endDate: string;
    public price: number;
    public image: UploadedFile;
    public imageUrl: string;

    public constructor(vacation: VacationModel) {
        this.id = vacation.id;
        this.destination = vacation.destination;
        this.description = vacation.description;
        this.startDate = vacation.startDate;
        this.endDate = vacation.endDate;
        this.price = vacation.price;
        this.image = vacation.image;
        this.imageUrl = vacation.imageUrl;
    }

    //creating schema for validating product insert: 
    private static insertValidationSchema = Joi.object({
        id: Joi.number().forbidden(),
        destination:Joi.string().required().min(2).max(50),
        description:Joi.string().required().min(10).max(3000),
        startDate:Joi.string().required(),
        endDate:Joi.string().required(),
        price: Joi.number().required().min(0).max(10000),
        image: Joi.object().required(),
        imageUrl: Joi.string().optional().max(200)
    });

    //creating schema for validating product insert: 
    private static updateValidationSchema = Joi.object({
        id: Joi.number().required().min(1).integer(),
        destination:Joi.string().min(2).max(50),
        description:Joi.string().min(10).max(3000),
        startDate:Joi.string(),
        endDate:Joi.string(),
        price: Joi.number().required().min(0).max(10000),
        image: Joi.object().optional(),
        imageUrl: Joi.string().optional().max(200)
    });

    public validateInsert(): void {
        const result = VacationModel.insertValidationSchema.validate(this);
        if (result.error) throw new ValidationError(result.error.message);
    }

    public validateUpdate(): void {
        const result = VacationModel.updateValidationSchema.validate(this);
        if (result.error) throw new ValidationError(result.error.message);
    }
}