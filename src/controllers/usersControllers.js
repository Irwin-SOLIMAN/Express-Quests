const database = require("../../database");


const getUsers = (req, res) => {
    database
    .query("select * from users")
    .then(([users]) => {
      res.json(users); // use res.json instead of console.log
    })
    .catch((err) => {
      console.error(err);
      res.sendStatus(500);
    });
  };
  
  const getUsersByID = (req, res) => {
    const id = parseInt(req.params.id);
  
    database
      .query("select * from users where id = ?", [id])
      .then(([users]) => {
        if (users[0] != null) {
          res.json(users[0]);
        } else {
          res.sendStatus(404);
        }
      })
      .catch((err) => {
        console.error(err);
        res.sendStatus(500);
      });
  };
  
  const postUser = (req, res) => {
    const {firstname, lastname, email, city, language } = req.body;
  

if (firstname && lastname && email && city && language) {
  database
  .query(
    "INSERT INTO users(firstname, lastname, email, city, language) VALUES (?, ?, ?, ?, ?)",
    [firstname, lastname, email, city, language]
  )
  .then(([result]) => {

    const  newUser = {
      id: result.insertId,
      firstname,
      lastname,
      email,
      city,
      language
    }

    res.status(201).send(newUser);
  })
} else {
  database
  .catch((err) => {
    console.error(err);
    res.sendStatus(500);
  });
}
  };
  
  module.exports = {
    getUsers,
    getUsersByID,
    postUser,
  };
  