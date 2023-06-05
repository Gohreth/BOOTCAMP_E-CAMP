const http = require("http");
const fs = require("fs/promises");

const BASE_PATH = "/api/v1/anime";
const PORT = 3000;

//Dependiendo del NODE_ENV se utilizarán archivos diferentes
const JSON_FILE_PATH =
  process.env.NODE_ENV === "testing" ? "./anime.test.json" : "./anime.json";
const AUTO_INDEX_PATH =
  process.env.NODE_ENV === "testing"
    ? "./auto_index.test.txt"
    : "./auto_index.txt";

class FileManager {
  //Simula el autoincremento del identificador único
  static AUTO_INDEX;

  static async readFile(path) {
    try {
      const data = await fs.readFile(path, "utf-8");
      const jsonData = JSON.parse(data);
      return jsonData;
    } catch (error) {
      console.log(error);
      return null;
    }
  }

  static async writeFile(path, jsonData) {
    try {
      const data = JSON.stringify(jsonData);
      await fs.writeFile(path, data, "utf-8");
    } catch (error) {
      console.log(error);
    }
  }

  static async initializeAutoIndex(path, fallbackPath) {
    try {
      await fs.access(path);
      const data = await this.readFile(path);
      if (!!!data) return;
      this.AUTO_INDEX = parseInt(data);
      return;
    } catch (error) {
      const fallbackData = await this.readFile(fallbackPath);
      if (!!!fallbackData) return;
      this.AUTO_INDEX = Object.keys(fallbackData).length;
    } finally {
      await this.persistCurrentIndex(path);
    }
  }

  static async persistCurrentIndex(path) {
    try {
      await fs.writeFile(path, this.AUTO_INDEX.toString(), "utf-8");
    } catch (error) {
      console.log(error);
    }
  }
}

class Utilities {
  static filterData(data, { id, name }) {
    let results = {};
    //Chequea igualdad de strings sin sensibilidad a mayúsculas
    if (name) name = name.toLowerCase();
    if (id && name) {
      for (const [key, value] of Object.entries(data)) {
        if (key === id && value.nombre.toLowerCase() === name)
          results = Object.fromEntries(new Map([[key, value]]));
      }
    }
    if (id && !!!name) {
      for (const [key, value] of Object.entries(data)) {
        if (key === id) results = Object.fromEntries(new Map([[key, value]]));
      }
    }
    if (name && !!!id) {
      for (const [key, value] of Object.entries(data)) {
        if (value.nombre.toLowerCase() === name)
          results = Object.fromEntries(new Map([[key, value]]));
      }
    }
    return results;
  }

  static checkRequestBody(body) {
    let bodyJSON;
    try {
      bodyJSON = JSON.parse(body);
    } catch (error) {
      bodyJSON = {};
    }
    const neededKeys = ["nombre", "genero", "año", "autor"];
    for (const key of neededKeys) {
      if (!!!bodyJSON[key]) return {};
    }
    return bodyJSON;
  }

  static checkId(data, { id }) {
    if (!!!data[id]) return false;
    return true;
  }
}

class CRUD {
  constructor(path) {
    this.path = path;
  }

  #postData(data, newAnime) {
    data[(FileManager.AUTO_INDEX + 1).toString()] = newAnime;
    return data;
  }

  #updateData(data, newAnime, { id }) {
    data[id] = newAnime;
    return data;
  }

  #deleteData(data, { id }) {
    delete data[id];
    return data;
  }

  async getOperation(res, { id, name }) {
    const data = await FileManager.readFile(this.path);
    if (!!!id && !!!name) {
      res.writeHead(200, { "Content-Type": "application/json" });
      return res.end(JSON.stringify(data));
    }
    const filteredData = Utilities.filterData(data, { id, name });
    if (Object.keys(filteredData).length === 0) {
      res.writeHead(404, { "Content-Type": "text/plain" });
      return res.end("No se encontraron resultados");
    }
    res.writeHead(200, { "Content-Type": "application/json" });
    return res.end(JSON.stringify(filteredData));
  }

  async postOperation(req, res) {
    const data = await FileManager.readFile(this.path);

    let body = "";

    req.setEncoding("utf-8");
    req.on("data", (chunk) => {
      body += chunk;
    });
    req.on("end", async () => {
      const parsedBody = Utilities.checkRequestBody(body);
      if (Object.keys(parsedBody).length === 0) {
        res.writeHead(400, { "Content-Type": "text/plain" });
        return res.end("Cuerpo de la solicitud inválido");
      }
      const newData = this.#postData(data, parsedBody);
      await FileManager.writeFile(this.path, newData);
      FileManager.AUTO_INDEX++;
      FileManager.persistCurrentIndex(AUTO_INDEX_PATH);
      res.writeHead(201, { "Content-Type": "application/json" });
      return res.end(JSON.stringify(newData));
    });
  }

  async putOperation(req, res, { id }) {
    const data = await FileManager.readFile(this.path);
    if (!!!id) {
      res.writeHead(400, { "Content-Type": "text/plain" });
      return res.end("No se ha especificado un id para actualizar");
    }
    if (!Utilities.checkId(data, { id })) {
      res.writeHead(404, { "Content-Type": "text/plain" });
      return res.end("No se ha encontrado anime con id: " + id);
    }

    let body = "";

    req.setEncoding("utf-8");
    req.on("data", (chunk) => {
      body += chunk;
    });
    req.on("end", async () => {
      const parsedBody = Utilities.checkRequestBody(body);
      if (Object.keys(parsedBody).length === 0) {
        res.writeHead(400, { "Content-Type": "text/plain" });
        return res.end("Cuerpo de la solicitud inválido");
      }
      const newData = this.#updateData(data, parsedBody, { id });
      await FileManager.writeFile(this.path, newData);
      res.writeHead(200, { "Content-Type": "application/json" });
      return res.end(JSON.stringify(newData));
    });
  }

  async deleteOperation(res, { id }) {
    const data = await FileManager.readFile(this.path);
    if (!!!id) {
      res.writeHead(400, { "Content-Type": "text/plain" });
      return res.end("No se ha especificado un id para eliminar");
    }
    if (!Utilities.checkId(data, { id })) {
      res.writeHead(404, { "Content-Type": "text/plain" });
      return res.end("No se ha encontrado anime con id: " + id);
    }
    const newData = this.#deleteData(data, { id });
    await FileManager.writeFile(this.path, newData);
    res.writeHead(200, { "Content-Type": "application/json" });
    return res.end(JSON.stringify(newData));
  }
}

const CRUDInstance = new CRUD(JSON_FILE_PATH);

const server = http.createServer(async (req, res) => {
  if (!!!FileManager.AUTO_INDEX)
    await FileManager.initializeAutoIndex(AUTO_INDEX_PATH, JSON_FILE_PATH);

  const url = new URL(req.url, `http://${req.headers.host}`);

  if (url.pathname === "/") {
    res.writeHead(200, { "Content-Type": "text/plain" });
    return res.end("M6 Final Drilling");
  }

  if (url.pathname !== BASE_PATH) {
    res.writeHead(404, { "Content-Type": "text/plain" });
    return res.end("404 no encontrado");
  }
  const id = url.searchParams.get("id");
  const name = url.searchParams.get("nombre");

  switch (req.method) {
    case "GET":
      try {
        await CRUDInstance.getOperation(res, { id, name });
      } catch (error) {
        console.error(error);
      } finally {
        break;
      }
    case "POST":
      try {
        await CRUDInstance.postOperation(req, res);
      } catch (error) {
        console.error(error);
      } finally {
        break;
      }
    case "PUT":
      try {
        await CRUDInstance.putOperation(req, res, { id });
      } catch (error) {
        console.error(error);
      } finally {
        break;
      }
    case "DELETE":
      try {
        await CRUDInstance.deleteOperation(res, { id });
      } catch (error) {
        console.error(error);
      } finally {
        break;
      }
    default:
      res.writeHead(404, { "Content-Type": "text/plain" });
      return res.end("404 no encontrado");
  }
});

server.listen(PORT, () => console.log("Listening on port " + PORT));

module.exports = { server };
