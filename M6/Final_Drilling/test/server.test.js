const chai = require("chai");
const chaiHttp = require("chai-http");
const { server } = require("../index");
const { before, beforeEach, after } = require("mocha");
const fs = require("fs/promises");

chai.use(chaiHttp);

describe("Testeando respuesta de servidor", () => {
  it("Comprobando que el servidor responde", (done) => {
    chai
      .request(server)
      .get("/")
      .end((err, res) => {
        chai.assert.equal(res.status, 200);
        chai.assert.equal(res.text, "M6 Final Drilling");
        done();
      });
  });
});

describe("Testeando CRUD", () => {
  let backupData;
  let data, autoIndex;
  before(async () => {
    try {
      backupData = await fs.readFile("./anime.test.json", "utf-8");
    } catch (error) {
      console.log(error);
    }
  });

  beforeEach(async () => {
    try {
      data = await fs.readFile("./anime.test.json", "utf-8");
      data = JSON.parse(data);
      autoIndex = await fs.readFile("./auto_index.test.txt", "utf-8");
      autoIndex = parseInt(autoIndex);
    } catch (error) {
      console.log(error);
    }
  });

  after(async () => {
    try {
      await fs.writeFile("./anime.test.json", backupData, "utf-8");
      await fs.access("./auto_index.test.txt");
      await fs.rm("./auto_index.test.txt");
    } catch (error) {
      console.log(error);
    }
  });

  it("Comprobando respuesta GET sin id ni nombre", (done) => {
    chai
      .request(server)
      .get("/api/v1/anime")
      .end((err, res) => {
        chai.assert.equal(res.status, 200);
        chai.assert.equal(res.text, JSON.stringify(data));
        done();
      });
  });

  it("Comprobando respuesta GET con id", (done) => {
    chai
      .request(server)
      .get("/api/v1/anime?id=1")
      .end((err, res) => {
        const expectedData = Object.fromEntries(
          Object.entries(data).filter(([key, value]) => key === "1")
        );

        chai.assert.equal(res.text, JSON.stringify(expectedData));
        done();
      });
  });

  it("Comprobando respuesta GET con nombre", (done) => {
    chai
      .request(server)
      .get("/api/v1/anime?nombre=Akira")
      .end((err, res) => {
        const expectedData = Object.fromEntries(
          Object.entries(data).filter(
            ([key, value]) => value.nombre === "Akira"
          )
        );

        chai.assert.equal(res.text, JSON.stringify(expectedData));
        done();
      });
  });

  it("Comprobando respuesta GET con id y nombre", (done) => {
    chai
      .request(server)
      .get("/api/v1/anime?id=1&nombre=Akira")
      .end((err, res) => {
        const expectedData = Object.fromEntries(
          Object.entries(data).filter(
            ([key, value]) => value.nombre === "Akira" && key === "1"
          )
        );

        chai.assert.equal(res.text, JSON.stringify(expectedData));
        done();
      });
  });

  it("Comprobando respuesta GET con id y nombre erróneos", (done) => {
    chai
      .request(server)
      .get("/api/v1/anime?id=1000&nombre=NoExiste")
      .end((err, res) => {
        const expectedData = Object.fromEntries(
          Object.entries(data).filter(
            ([key, value]) => value.nombre === "Akira" && key === "1"
          )
        );
        chai.assert.equal(res.status, 404);
        chai.assert.equal(res.text, "No se encontraron resultados");
        done();
      });
  });

  it("Comprobando respuesta a una solicitud POST", (done) => {
    let newEntry = {
      nombre: "Name Test",
      genero: "Genre Test",
      año: 2023,
      autor: "Author Test",
    };

    let expectedData = structuredClone(data);
    expectedData[(autoIndex + 1).toString()] = newEntry;

    chai
      .request(server)
      .post("/api/v1/anime")
      .set("content-type", "application/json")
      .send(newEntry)
      .end((err, res) => {
        chai.assert.equal(res.status, 201);
        chai.assert.equal(res.text, JSON.stringify(expectedData));
        done();
      });
  });

  it("Comprobando respuesta a una mala solicitud POST", (done) => {
    let newEntry = {
      nombre: "Name Test",
      genero: "Genre Test",
      //Faltan dos atributos para que sea válida
      // año: 2023,
      // autor: "Author Test",
    };

    let expectedData = structuredClone(data);
    expectedData[(autoIndex + 1).toString()] = newEntry;

    chai
      .request(server)
      .post("/api/v1/anime")
      .set("content-type", "application/json")
      .send(newEntry)
      .end((err, res) => {
        chai.assert.equal(res.status, 400);
        chai.assert.equal(res.text, "Cuerpo de la solicitud inválido");
        done();
      });
  });

  it("Comprobando respuesta a una solicitud PUT", (done) => {
    let newEntry = {
      nombre: "Name Test",
      genero: "Genre Test",
      año: 2023,
      autor: "Author Test",
    };

    const entryId = "1";

    let expectedData = structuredClone(data);
    expectedData[entryId] = newEntry;

    chai
      .request(server)
      .put("/api/v1/anime?id=1")
      .set("content-type", "application/json")
      .send(newEntry)
      .end((err, res) => {
        chai.assert.equal(res.status, 200);
        chai.assert.equal(res.text, JSON.stringify(expectedData));
        done();
      });
  });

  it("Comprobando respuesta a una mala solicitud PUT", (done) => {
    let newEntry = {
      nombre: "Name Test",
      genero: "Genre Test",
      //Faltan dos atributos para que sea válida
      // año: 2023,
      // autor: "Author Test",
    };

    const entryId = "1";

    let expectedData = structuredClone(data);
    expectedData[entryId] = newEntry;

    chai
      .request(server)
      .put("/api/v1/anime?id=1")
      .set("content-type", "application/json")
      .send(newEntry)
      .end((err, res) => {
        chai.assert.equal(res.status, 400);
        chai.assert.equal(res.text, "Cuerpo de la solicitud inválido");
        done();
      });
  });

  it("Comprobando respuesta a una mala solicitud PUT sin id", (done) => {
    let newEntry = {
      nombre: "Name Test",
      genero: "Genre Test",
      año: 2023,
      autor: "Author Test",
    };

    const entryId = "1";

    let expectedData = structuredClone(data);
    expectedData[entryId] = newEntry;

    chai
      .request(server)
      .put("/api/v1/anime")
      .set("content-type", "application/json")
      .send(newEntry)
      .end((err, res) => {
        chai.assert.equal(res.status, 400);
        chai.assert.equal(
          res.text,
          "No se ha especificado un id para actualizar"
        );
        done();
      });
  });

  it("Comprobando respuesta a una mala solicitud PUT con id no existente", (done) => {
    const entryId = "1000";
    let newEntry = {
      nombre: "Name Test",
      genero: "Genre Test",
      año: 2023,
      autor: "Author Test",
    };

    chai
      .request(server)
      .put("/api/v1/anime?id=" + entryId)
      .set("content-type", "application/json")
      .send(newEntry)
      .end((err, res) => {
        chai.assert.equal(res.status, 404);
        chai.assert.equal(
          res.text,
          "No se ha encontrado anime con id: " + entryId
        );
        done();
      });
  });

  it("Comprobando respuesta a una solicitud DELETE", (done) => {
    const entryId = "1";
    let expectedData = structuredClone(data);
    delete expectedData[entryId];
    chai
      .request(server)
      .delete("/api/v1/anime?id=1")
      .end((err, res) => {
        chai.assert.equal(res.status, 200);
        chai.assert.equal(res.text, JSON.stringify(expectedData));
        done();
      });
  });

  it("Comprobando respuesta a una mala solicitud DELETE sin id", (done) => {
    chai
      .request(server)
      .delete("/api/v1/anime")
      .end((err, res) => {
        chai.assert.equal(res.status, 400);
        chai.assert.equal(
          res.text,
          "No se ha especificado un id para eliminar"
        );
        done();
      });
  });

  it("Comprobando respuesta a una mala solicitud DELETE con id no existente", (done) => {
    const entryId = "1000";
    chai
      .request(server)
      .delete("/api/v1/anime?id=" + entryId)
      .end((err, res) => {
        chai.assert.equal(res.status, 404);
        chai.assert.equal(
          res.text,
          "No se ha encontrado anime con id: " + entryId
        );
        done();
      });
  });

  it("Comprobando respuesta a solicitud DELETE comparando con datos originales", (done) => {
    let previousData = structuredClone(data);
    chai
      .request(server)
      .delete("/api/v1/anime?id=2") //ID 1 ya fue eliminado en un test anterior
      .end((err, res) => {
        chai.assert.equal(res.status, 200);
        chai.assert.notEqual(res.text, previousData);
        done();
      });
  });
});
