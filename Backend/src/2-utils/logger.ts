import fsPromises from "fs/promises";

class Logger {

    private filePath = "errors/errors.log";
    //add error ro our errors text file
    public async logError(err: any): Promise<void> {
        const now = new Date();
        const content = `Time: ${now}\nMessage: ${err.message}\nStack: ${err.stack}\n---------------------------------------\n\n`
        fsPromises.appendFile(this.filePath, content);
    }

}

export const logger = new Logger();
