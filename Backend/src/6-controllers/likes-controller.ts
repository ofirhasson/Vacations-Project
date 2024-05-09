import express, { Request, Response, NextFunction } from "express";
import { likesService } from "../5-services/likes-service";
import { StatusCode } from "../3-models/enums";

class LikesController {

    public readonly router = express.Router();
    public constructor() {
        this.registerRoutes();
    }

    private registerRoutes(): void {
        this.router.post("/likes/user/:userId(\\d+)/vacation/:vacationId(\\d+)", this.addLike);
        this.router.delete("/likes/user/:userId(\\d+)/vacation/:vacationId(\\d+)", this.deleteLike);
    }

    // POST http://localhost:4000/api/likes/user/7/vacation/8
    private async addLike(request: Request, response: Response, next: NextFunction): Promise<void> {
        try {
            const userId = +request.params.userId;
            const vacationId = +request.params.vacationId;
            await likesService.addLike(userId, vacationId);
            response.sendStatus(StatusCode.Created);
        }
        catch (err: any) { next(err); }
    }

    // DELETE http://localhost:4000/api/likes/user/7/vacation/8
    private async deleteLike(request: Request, response: Response, next: NextFunction): Promise<void> {
        try {
            const userId = +request.params.userId;
            const vacationId = +request.params.vacationId;
            await likesService.deleteLike(userId, vacationId);
            response.sendStatus(StatusCode.NoContent);
        }
        catch (err: any) { next(err); }
    }

}

const likesController = new LikesController();
export const likesRouter = likesController.router;
