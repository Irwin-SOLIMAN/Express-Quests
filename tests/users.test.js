const crypto = require("node:crypto");
const request = require("supertest");
const app = require("../src/app");

const database = require("../database");
afterAll(() => database.end());

describe("GET /api/users", () => {
  it("should return all users", async () => {
    const response = await request(app).get("/api/users");

    expect(response.headers["content-type"]).toMatch(/json/);

    expect(response.status).toEqual(200);
  });
});

describe("GET /api/users/:id", () => {
  it("should return one user", async () => {
    const response = await request(app).get("/api/users/1");

    expect(response.headers["content-type"]).toMatch(/json/);

    expect(response.status).toEqual(200);
  });

  it("should return no user", async () => {
    const response = await request(app).get("/api/users/0");

    expect(response.status).toEqual(404);
  });
}

);

describe("POST /api/users", () => {
  it("should return created user", async () => {
    const newUser = {
      firstname: "Marie",
      lastname: "Martin",
      email: `${crypto.randomUUID()}@wild.co`,
      city: "Paris",
      language: "French",
    };


    const response = await request(app).post("/api/users").send(newUser);

    expect(response.status).toEqual(201);

    expect(response.body).toHaveProperty("firstname");
    expect(typeof response.body.firstname).toBe("string");

    expect(response.body).toHaveProperty("lastname");
    expect(typeof response.body.lastname).toBe("string");

    expect(response.body).toHaveProperty("email");
    expect(typeof response.body.email).toBe("string");

    expect(response.body).toHaveProperty("city");
    expect(typeof response.body.city).toBe("string");

    expect(response.body).toHaveProperty("language");
    expect(typeof response.body.language).toBe("string");

    expect(response.body).toHaveProperty("id");
    expect(typeof response.body.id).toBe("number");


    const [result] = await database.query(
      "SELECT * FROM movies WHERE id=?",
      response.body.id
    );

    const [userInDatabase] = result;

    expect(userInDatabase).toHaveProperty("id");

  });


  it("should return an error", async () => {
    const userWithMissingProps = { firstname: "Joe", };
  
    const response = await request(app)
      .post("/api/users")
      .send(userWithMissingProps);
  
    expect(response.status).toEqual(422);
  });
  
});


describe("PUT /api/users/:id", () => {
  it("should edit user", async () => {
    const newUser = {
      firstname: "Joe",
      lastname: "GY",
      email: `${crypto.randomUUID()}@wild.co`,
      city: "Paris",
      language: "French",
    };

    const [result2] = await database.query(
      "INSERT INTO users(firstname, lastname, email, city, language) VALUES (?, ?, ?, ?, ?)",
      [newUser.firstname, newUser.lastname, newUser.email, newUser.city, newUser.language]
    );

    const id = result2.insertId;

    const updatedUser = {
      firstname: "Johny",
      lastname: "LA DEBROUILLE",
      email: `${crypto.randomUUID()}@wild.co`,
      city: "LONDRE",
      language: "ANGLAIS",
    };

    const response2 = await request(app)
      .put(`/api/users/${id}`)
      .send(updatedUser);

    expect(response2.status).toEqual(204);

    const [result] = await database.query("SELECT * FROM users WHERE id=?", id);

    const [response] = result;

  
    expect(response).toHaveProperty("id");

    expect(response).toHaveProperty("firstname");
    expect(response.firstname).toStrictEqual(updatedUser.firstname);

    expect(response).toHaveProperty("lastname");
    expect(response.lastname).toStrictEqual(updatedUser.lastname);

    expect(response).toHaveProperty("email");
    expect(response.email).toStrictEqual(updatedUser.email);

    expect(response).toHaveProperty("city");
    expect(response.city).toStrictEqual(updatedUser.city);

    expect(response).toHaveProperty("language");
    expect(response.language).toStrictEqual(updatedUser.language);


  });

  it("should return an error", async () => {
    const userWithMissingProps = { firstname: "Mr Potter" };

    const response = await request(app)
      .put(`/api/users/1`)
      .send(userWithMissingProps);

    expect(response.status).toEqual(422);
  });

  it("should return no user", async () => {
    const newUser = {
      firstname: "Henry",
      lastname: "LE GENTIL",
      email: `${crypto.randomUUID()}@wild.co`,
      city: "NANTES",
      language: "ANGLAIS",
    };

    const response = await request(app).put("/api/users/0").send(newUser);

    expect(response.status).toEqual(404);
  });
});


describe("DELETTE /api/users/:id", () => {
  it("should remove user", async () => {
    const newUser = {
      firstname: "Joe",
      lastname: "GY",
      email: `${crypto.randomUUID()}@wild.co`,
      city: "Paris",
      language: "French",
    };

    const [result2] = await database.query(
      "INSERT INTO users(firstname, lastname, email, city, language) VALUES (?, ?, ?, ?, ?)",
      [newUser.firstname, newUser.lastname, newUser.email, newUser.city, newUser.language]
    );

    const id = result2.insertId;

    const response = await request(app)
      .delete(`/api/users/${id}`)
      .send("Delete done");

    expect(response.status).toEqual(204);

    
  });

  it("should fail because no ID valid", async () => {

    
    const response = await request(app)
    .delete(`/api/users/5000`)
   

    expect(response.status).toEqual(404);
  })


});
