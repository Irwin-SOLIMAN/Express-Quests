const database = require("../../database");

const getMovies = (req, res) => {
  database
  .query("select * from movies")
  .then(([movies]) => {
    res.json(movies); // use res.json instead of console.log
  })
  .catch((err) => {
    console.error(err);
    res.sendStatus(500);
  });
};

const getMovieById = (req, res) => {
  const id = parseInt(req.params.id);

  database
    .query("select * from movies where id = ?", [id])
    .then(([movies]) => {
      if (movies[0] != null) {
        res.json(movies[0]);
      } else {
        res.sendStatus(404);
      }
    })
    .catch((err) => {
      console.error(err);
      res.sendStatus(500);
    });
};

const postMovie = (req, res) => {
  const { title, director, year, color, duration } = req.body;

  if(title && director && year && color && duration) {
  database
    .query(
      "INSERT INTO movies(title, director, year, color, duration) VALUES (?, ?, ?, ?, ?)",
      [title, director, year, color, duration]
    )
    .then(([result]) => {

      const newMovies = {
        id: result.insertId,
        title,
        director,
        year,
        color,
        duration,
      }

      res.status(201).send(newMovies);
     
    })

  }
  else {
    database
    .catch((err) => {
      console.error(err);
      res.status(422).send("Client Error");
    });
  }

};


const updateMovie = (req, res) => {
  const id = parseInt(req.params.id);
  const { title, director, year, color, duration } = req.body;
  if(title && director && year && color && duration) {
  database
    .query(
      "update movies set title = ?, director = ?, year = ?, color = ?, duration = ? where id = ?",
      [title, director, year, color, duration, id]
    )
    .then(([result]) => {
      if (result.affectedRows === 0) {
        res.sendStatus(404);
      } else {
        res.sendStatus(204);
      }
    })
  }
  else {
    database
  
    .catch((err) => {
      console.error(err);
      res.sendStatus(422);
    });
  }
};

const deleteMovie = (req, res) => {
  const id = parseInt(req.params.id);

if(id) {
  database
    .query("delete from movies where id = ?", [id])
    .then(([result]) => {
      if (result.affectedRows === 0) {
        res.sendStatus(404);
      } else {
        res.sendStatus(204);
      }
    })
  } else {
    database
    .catch((err) => {
      console.error(err);
      res.sendStatus(404);
    });
  } 
}




module.exports = {
  getMovies,
  getMovieById,
  postMovie,
  updateMovie,
  deleteMovie,
};
