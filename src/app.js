const express = require("express");
const cors = require("cors");

const { uuid } = require("uuidv4");

const app = express();

app.use(express.json());
app.use(cors());

const repositories = [];

app.get("/repositories", (request, response) => {
  response.json(repositories)
});

app.post("/repositories", (request, response) => {
  const { title, url, techs } = request.body;

  const newRepository = {
    id: uuid(),
    title,
    url,
    techs,
    likes: 0
  }
  repositories.push(newRepository)

  response.json(newRepository);
});

app.put("/repositories/:id", (request, response) => {
  const { id } = request.params;
  const { title, url, techs } = request.body;

  const projectIndex = repositories.findIndex(repository => repository.id === id);

  if(projectIndex < 0) {
    return response.status(400).json({ error: "Repositoy not found" })
  }
  
  const updatedProject = {
    id,
    title,
    url,
    techs,
    likes: repositories[projectIndex].likes
  }

  repositories[projectIndex] = updatedProject;

  return response.json({ updatedProject })
});

app.delete("/repositories/:id", (request, response) => {
  const { id } = request.params;

  const projectIndex = repositories.findIndex(repository => repository.id === id);
  
  if(projectIndex < 0) {
    return response.status(400).json({ error: "Repositoy not found" })
  } else {
    repositories.splice(projectIndex, 1);
    return response.status(204).send();
  }
});

app.post("/repositories/:id/like", (request, response) => {
  const { id } = request.params;

  const projectIndex = repositories.findIndex(repository => repository.id == id);
  
  if(projectIndex < 0) {
    return response.status(400).json({ error: "Repositoy not found" })
  }

  repositories[projectIndex].likes++;

  response.json({ "likes": repositories[projectIndex].likes })
});

module.exports = app;
