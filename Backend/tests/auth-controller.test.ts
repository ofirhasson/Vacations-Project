import { describe, it } from "mocha";
import { expect } from "chai";
import supertest from "supertest";
import { app } from "../src/app";
import { StatusCode } from "../src/3-models/enums";

function generateRandomEmail(): string {
    const characters = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let email = '';
    for (let i = 0; i < 10; i++) {
        email += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    email += '@gmail.com';
    return email;
}

describe("Testing Auth controller", () => {

    it("register - Should return token", async () => {
        const response = await supertest(app.server).post(`/api/register`)
            .field("firstName", "moishe")
            .field("lastName", "cohen")
            .field("email", generateRandomEmail())
            .field("password", "1234")
            .field("role", "user")
        const token = response.body;
        expect(response.status).to.be.equal(StatusCode.Created);
        expect(typeof token).to.be.equal('string');
    })

    it("login - Should return token", async () => {
        const response = await supertest(app.server).post(`/api/login`)
            .field("email", "ofirhasson@gmail.com")
            .field("password", "1234")
        const token = response.body;
        expect(typeof token).to.be.equal('string');
    })

})