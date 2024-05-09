import express, { NextFunction, Request, Response } from "express";
import { securityMiddleware } from "../4-middleware/security-middleware";
import { vacationsService } from "../5-services/vacation-service";
import { VacationModel } from "../3-models/vacation-model";
import { StatusCode } from "../3-models/enums";
import { fileSaver } from "uploaded-file-saver";

class VacationController {

    public readonly router = express.Router();
    public constructor() {
        this.registerRoutes();
    }

    private registerRoutes(): void {
        this.router.get("/vacations/:id(\\d+)", securityMiddleware.verifyLoggedIn, this.getAllFilteredVacations);
        this.router.get("/vacation/:id(\\d+)", securityMiddleware.verifyLoggedIn, this.getOneVacation);
        this.router.post("/vacations", securityMiddleware.verifyLoggedIn, securityMiddleware.verifyAdmin, this.addVacation);
        this.router.put("/vacations/:id(\\d+)", securityMiddleware.verifyLoggedIn, securityMiddleware.verifyAdmin, this.updateVacation);
        this.router.delete("/vacations/:id(\\d+)", securityMiddleware.verifyLoggedIn, securityMiddleware.verifyAdmin, this.deleteVacation);
        this.router.get("/vacations/images/:imageName", this.getImageFile);
    }

    // GET http://localhost:4000/api/vacation/7
    private async getOneVacation(request: Request, response: Response, next: NextFunction): Promise<void> {
        try {
            const id = +request.params.id;
            const vacation = await vacationsService.getOneVacation(id);
            response.json(vacation); // status = 200
        }
        catch (err: any) { next(err); }
    }

    // POST http://localhost:4000/api/vacations
    private async addVacation(request: Request, response: Response, next: NextFunction): Promise<void> {
        try {
            request.body.image = request.files?.image;
            const vacation = new VacationModel(request.body);
            const addedVacation = await vacationsService.addVacation(vacation);
            response.status(StatusCode.Created).json(addedVacation);
        }
        catch (err: any) { next(err); }
    }

    // PUT http://localhost:4000/api/vacations/7
    private async updateVacation(request: Request, response: Response, next: NextFunction): Promise<void> {
        try {
            request.body.id = +request.params.id;
            request.body.image = request.files?.image;
            const vacation = new VacationModel(request.body);
            const updatedVacation = await vacationsService.updateVacation(vacation);
            response.json(updatedVacation); // status = 200
        }
        catch (err: any) { next(err); }
    }

    // GET http://localhost:4000/api/vacations/7
    private async getAllFilteredVacations(request: Request, response: Response, next: NextFunction): Promise<void> {
        try {
            const id = +request.params.id;
            const filter = request?.query;
            const vacationsAndTotalRows = await vacationsService.getAllFilteredVacations(id, filter);
            response.json(vacationsAndTotalRows);
        }
        catch (err: any) { next(err); }
    }

    // DELETE http://localhost:4000/api/vacations/7
    private async deleteVacation(request: Request, response: Response, next: NextFunction): Promise<void> {
        try {
            const id = +request.params.id;
            await vacationsService.deleteVacation(id);
            response.sendStatus(StatusCode.NoContent); //status + send
        }
        catch (err: any) { next(err); }
    }

    // GET http://localhost:4000/api/vacations/images/:imageName
    private async getImageFile(request: Request, response: Response, next: NextFunction): Promise<void> {
        try {
            const imageName = request.params.imageName;
            const imagePath = fileSaver.getFilePath(imageName, true);
            response.sendFile(imagePath);
        }
        catch (err: any) { next(err); }
    }
}

const vacationController = new VacationController();
export const vacationsRouter = vacationController.router;
