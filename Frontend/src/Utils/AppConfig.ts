class AppConfig {

    //Production
    // private host = "54.201.82.70";

    //Development
    private host = "localhost";

    // Backend urls:
    public readonly vacationsUrl = `http://${this.host}:4000/api/vacations/`;
    public readonly vacationUrl = `http://${this.host}:4000/api/vacation/`;
    public readonly likesUrl = `http://${this.host}:4000/api/likes/`;
    public readonly registerUrl = `http://${this.host}:4000/api/register/`;
    public readonly loginUrl = `http://${this.host}:4000/api/login/`;

    //Axios options:
    public readonly axiosOptions = {
        headers: { // Tell axios to also send the image:
            "Content-Type": "multipart/form-data" // We're sending also files.
        }
    };
}

export const appConfig = new AppConfig();
