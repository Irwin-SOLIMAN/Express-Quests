const express = require("express");
require("dotenv").config();

const app = express();
app.use(express.json())

const movieControllers = require("./controllers/movieControllers");
const usersControllers = require("./controllers/usersControllers");
const validateMovie = require("./middlewares/validateMovie");
const validateUser = require("./middlewares/validateUser");

app.post("/api/movies", validateMovie, movieControllers.postMovie);

app.get("/api/movies", movieControllers.getMovies);
app.get("/api/movies/:id", movieControllers.getMovieById);
app.get("/api/users", usersControllers.getUsers)
app.get("/api/users/:id", usersControllers.getUsersByID)

// app.post("/api/movies", movieControllers.postMovie);
app.post("/api/users", validateUser, usersControllers.postUser);

app.put("/api/movies/:id", validateMovie, movieControllers.updateMovie);
app.put("/api/users/:id", validateUser, usersControllers.updateUser);


module.exports = app;
