const express = require("express");
const cors = require("cors");

const { uuid, isUuid } = require("uuidv4");

const app = express();

app.use(express.json());
app.use(cors());

function validateProjectId(request, response, next){
  const { id } = request.params
  if ( !isUuid(id) ){
    return response.status(400).json({error: "Id is not a uuid"})
  }

  return next()
} 

app.use('/repositories/:id', validateProjectId)
app.use('/repositories/:id/like', validateProjectId)

const repositories = [];

app.get("/repositories", (request, response) => {
  console.log(repositories)
  return response.json(repositories)
});

app.post("/repositories", (request, response) => {
  const { title, url, techs } = request.body;

  const project = { id: uuid(), likes:0, title, url, techs }

  repositories.push(project)

  return response.json(project)
});

app.put("/repositories/:id", (request, response) => {
  const { id } = request.params
  const { title, url, techs } = request.body

  const projectIndex = repositories.findIndex( project => project.id == id )

  if(projectIndex < 0){
    return response.status(400).json({error: "Project not found" })
  }

  const project = { id, title, url, techs }

  repositories[projectIndex] = { ...repositories[projectIndex], title, url, techs }

  return response.status(200).json(repositories[projectIndex])
});

app.delete("/repositories/:id", (request, response) => {
  const { id } = request.params

  const projectIndex = repositories.findIndex( project => project.id == id )

  if(projectIndex < 0){
    return response.status(400).json({error: "Project not found" })
  }

  repositories.splice(projectIndex, 1)

  return response.status(204).send()
});

app.post("/repositories/:id/like", (request, response) => {
  const { id } = request.params;

  const projectIndex = repositories.findIndex( project => project.id == id )

  if(projectIndex < 0 || undefined){
    return response.status(400).json({error: "Project not found" })
  }

  repositories[projectIndex].likes += 1;

  const projectLiked = repositories.find( project => project.id = id )

  return response.json(projectLiked)
});

module.exports = app;
