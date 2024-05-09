import { describe, it } from "mocha";
import { expect } from "chai";
import supertest from "supertest";
import fs from "fs"
import { app } from "../src/app";
import { StatusCode } from "../src/3-models/enums";
import { VacationModel } from "../src/3-models/vacation-model";

interface VacationsAndTotalRows {
    vacations?: VacationModel[];
    totalRows?: number;
}

describe("Testing vacations controllers", () => {

    let image: Buffer;
    let token: string;
    let id: number;

    before(async () => {
        image = fs.readFileSync(__dirname + "\\resources\\vacation_image.jpg");
        const response = await supertest(app.server).post("/api/login")
            .send({ email: "ofirhasson18@gmail.com", password: "1234" });
        token = response.body;
    });

    it("Should return vacations array", async () => {
        const response = await supertest(app.server).get("/api/vacations/1").set("Authorization", "Bearer " + token);
        const vacationsAndTotalRows: VacationsAndTotalRows = response.body;
        expect(vacationsAndTotalRows.vacations.length).to.be.greaterThanOrEqual(1);
        expect(vacationsAndTotalRows.totalRows).to.be.greaterThanOrEqual(1);
        expect(vacationsAndTotalRows.vacations[0]).to.contain.keys("id", "destination", "description", "startDate", "endDate", "price", "imageUrl", "imageName", "isLiked", "likesCount");
    })

    it("Should return vacation", async () => {
        const response = await supertest(app.server).get("/api/vacation/25").set("Authorization", "Bearer " + token);
        const vacation: VacationModel = response.body;
        expect(vacation).to.not.be.empty;
        expect(vacation).to.contain.keys("id", "destination", "description", "startDate", "endDate", "price", "imageUrl", "imageName");

    });

    it("should add a new vacation", async () => {
        const response = await supertest(app.server).post("/api/vacations")
            .set("Authorization", "Bearer " + token)
            .field("destination", "aasdasdasdadasdsaaa")
            .field("description", "asdasdaddsadadasdasdad")
            .field("startDate", "2024-05-01")
            .field("endDate", "2024-05-06")
            .field("price", 560)
            .field("image", image)
        const addedVacation = response.body;
        id = addedVacation.id;
        expect(addedVacation).to.contain.keys("id", "destination", "description", "startDate", "endDate", "price", "imageUrl", "imageName");
    })

    it("should update an vacation", async () => {
        const response = await supertest(app.server).put(`/api/vacations/${id}`)
            .set("Authorization", "Bearer " + token)
            .field("destination", "bgtbghthth")
            .field("description", "thtyhthhyyhytyhh")
            .field("startDate", "2024-05-10")
            .field("endDate", "2024-05-16")
            .field("price", 600)
            .field("image", image)
        const updatedVacation = response.body
        expect(updatedVacation).to.contain.keys("id", "destination", "description", "startDate", "endDate", "price", "imageUrl", "imageName");
    });

    it("Should delete an vacation", async ()=>{
        const response = await supertest(app.server).delete(`/api/vacations/${id}`)
        .set("Authorization", "Bearer " + token);
        expect(response.body).to.be.empty;
        expect(response.status).to.be.equal(StatusCode.NoContent);
    })

    it("Should response with a 404 error", async () => {
        const response = await supertest(app.server).get("/api/aaaaa").set("Authorization", "Bearer " + token);
        expect(response.status).to.be.equal(StatusCode.NotFound)
    })

    it("Should response with a route not found error", async () => {
        const response = await supertest(app.server).get("/api/vacations/aaa").set("Authorization", "Bearer " + token);
        expect(response.status).to.be.equal(StatusCode.NotFound)
    })

    it("Should response with a resource not found error", async () => {
        const response = await supertest(app.server).delete("/api/vacations/20000").set("Authorization", "Bearer " + token);
        expect(response.status).to.be.equal(StatusCode.NotFound)
    })

})