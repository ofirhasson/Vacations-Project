import { describe, it } from "mocha";
import { expect } from "chai";
import supertest from "supertest";
import { app } from "../src/app";
import { StatusCode } from "../src/3-models/enums";

describe("Testing likes controller", () => {

    let token: string;
    
    before(async () => {
        const response = await supertest(app.server).post("/api/login")
            .send({ email: "ofirhasson@gmail.com", password: "1234" });
        token = response.body;
    });

    it("add like - Should response with a 201", async () => {
        const response = await supertest(app.server).post("/api/likes/user/5/vacation/25").set("Authorization", "Bearer " + token);
        expect(response.status).to.be.equal(StatusCode.Created)
    })

    it("Should response with a route not found error", async () => {
        const response = await supertest(app.server).delete("/api/likes/user/5/vacation/25").set("Authorization", "Bearer " + token);
        expect(response.status).to.be.equal(StatusCode.NoContent)
    })

})