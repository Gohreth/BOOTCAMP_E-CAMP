const http = require("http");

//Datos disponibles actualmente obtenidos desde el archivo .json
const data = require("./anime.json");

//Simula el autoincremento del identificador único
let AUTO_INDEX = Object.keys(data).length;

const BASE_PATH = "/api/v1/anime";
const PORT = 3000;
const CRUD = {
  GET: "GET",
  POST: "POST",
  DELETE: "DELETE",
  PUT: "PUT",
};

function getFilteredData(id, name) {
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

function postData(newAnime) {
  data[(AUTO_INDEX + 1).toString()] = newAnime;
  return data;
}

function updateData(id, newAnime) {
  data[id] = newAnime;
  return data;
}

function deleteData(id) {
  delete data[id];
  return data;
}

function checkRequestBody(body) {
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

function checkId(id) {
  if (!!!data[id]) return false;
  return true;
}

const server = http.createServer(async (req, res) => {
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

  let parsedBody;
  let body = "";
  switch (req.method) {
    case CRUD.GET:
      try {
        if (!!!id && !!!name) {
          res.writeHead(200, { "Content-Type": "application/json" });
          return res.end(JSON.stringify(data));
        }
        const filteredData = getFilteredData(id, name);
        if (Object.keys(filteredData).length === 0) {
          res.writeHead(404, { "Content-Type": "text/plain" });
          return res.end("No se encontraron resultados");
        }
        res.writeHead(200, { "Content-Type": "application/json" });
        return res.end(JSON.stringify(filteredData));
      } catch (error) {
        break;
      }

    case CRUD.POST:
      try {
        req.setEncoding("utf-8");
        req.on("data", (chunk) => {
          body += chunk;
        });
        req.on("end", () => {
          parsedBody = checkRequestBody(body);
          if (Object.keys(parsedBody).length === 0) {
            res.writeHead(400, { "Content-Type": "text/plain" });
            return res.end("Cuerpo de la solicitud inválido");
          }
          const newData = postData(parsedBody);
          AUTO_INDEX++;
          res.writeHead(201, { "Content-Type": "application/json" });
          return res.end(JSON.stringify(newData));
        });
        break;
      } catch (error) {
        break;
      }

    case CRUD.PUT:
      try {
        if (!!!id) {
          res.writeHead(400, { "Content-Type": "text/plain" });
          return res.end("No se ha especificado un id para actualizar");
        }
        if (!checkId(id)) {
          res.writeHead(404, { "Content-Type": "text/plain" });
          return res.end("No se ha encontrado anime con id: " + id);
        }
        req.setEncoding("utf-8");
        req.on("data", (chunk) => {
          body += chunk;
        });
        req.on("end", () => {
          parsedBody = checkRequestBody(body);
          if (Object.keys(parsedBody).length === 0) {
            res.writeHead(400, { "Content-Type": "text/plain" });
            return res.end("Cuerpo de la solicitud inválido");
          }
          res.writeHead(200, { "Content-Type": "application/json" });
          return res.end(JSON.stringify(updateData(id, parsedBody)));
        });
        break;
      } catch (error) {
        break;
      }

    case CRUD.DELETE:
      try {
        if (!!!id) {
          res.writeHead(400, { "Content-Type": "text/plain" });
          return res.end("No se ha especificado un id para eliminar");
        }
        if (!checkId(id)) {
          res.writeHead(404, { "Content-Type": "text/plain" });
          return res.end("No se ha encontrado anime con id: " + id);
        }
        res.writeHead(200, { "Content-Type": "application/json" });
        return res.end(JSON.stringify(deleteData(id)));
      } catch (error) {
        break;
      }

    default:
      res.writeHead(404, { "Content-Type": "text/plain" });
      return res.end("404 no encontrado");
  }
});

server.listen(PORT, () => console.log("Listening on port " + PORT));

module.exports = { server };
