const express = require("express");
const cors = require("cors");

const { uuid } = require("uuidv4");

const app = express();

app.use(express.json());
app.use(cors());

const repositories = [];
app.get("/repositories", (request, response) => {
  const { title } = request.body;
  var result =
    title ?
      repositories.filter(repository => repository.title.includes(title)) :
      repositories;

  return response.json(result);
});

app.post("/repositories", (request, response) => {
  const { title, url, techs } = request.body;
  const repository = {
    id: uuid(),
    url,
    title,
    techs,
    likes: 0
  }

  repositories.push(repository);
  return response.json(repository);
});

app.put("/repositories/:id", (request, response) => {
  var { id } = request.params;
  const { title, url, techs, likes } = request.body;

  var [repository] = repositories.filter(r => r.id == id);
  if (!Boolean(repository)) return response.status(400).json({ error: "Not Found" });
  var i = repositories.findIndex(r => r.id == id);
  repositories[i] = { ...repository, title, url, techs };

  return response.json(repositories[i]);
});

app.delete("/repositories/:id", (request, response) => {
  var { id } = request.params;
  var index = repositories.findIndex(r => r.id == id);
  if (index == -1) return response.status(400).json({ error: "Not Found" });

  repositories.splice(index, 1);
  return response.status(204).json(true);
});

app.post("/repositories/:id/like", (request, response) => {
  var { id } = request.params;
  var index = repositories.findIndex(r => r.id == id);
  if (index == -1) return response.status(400).json({ error: "Not Found" });
  repositories[index].likes += 1;

  return response.json(repositories[index]);
});

module.exports = app;
