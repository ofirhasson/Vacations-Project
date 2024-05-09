import cors from "cors";
import express from "express";
import expressFileUpload from "express-fileupload";
import path from "path";
import { fileSaver } from "uploaded-file-saver";
import { appConfig } from "./2-utils/app-config";
import { errorsMiddleware } from "./4-middleware/errors-middleware";
import { loggerMiddleware } from "./4-middleware/logger-middleware";
import { vacationsRouter } from "./6-controllers/vacation-controller";
import { authRouter } from "./6-controllers/auth-controller";
import { likesRouter } from "./6-controllers/likes-controller";

// Main application class:
class App {

    // Express server: 
    public server = express();

    // Start app:
    public start(): void {

        // Enable CORS requests:
        this.server.use(cors());

        // Create a request.body containing the given json from the front:
        this.server.use(express.json());

        // Create request.files containing uploaded files: 
        this.server.use(expressFileUpload());

        // Configure images folder: 
        fileSaver.config(path.join(__dirname, "1-assets", "images"));

        // lod request:
        this.server.use(loggerMiddleware.logToConsole);

        // Connect controllers
        this.server.use("/api", authRouter, vacationsRouter, likesRouter);
        
        // Route not found middleware: 
        this.server.use(errorsMiddleware.routeNotFound);

        // Catch all middleware: 
        this.server.use(errorsMiddleware.catchAll);

        this.server.listen(appConfig.port, () => console.log("Listening on http://localhost:" + appConfig.port));
    }

}

export const app = new App();
app.start();
