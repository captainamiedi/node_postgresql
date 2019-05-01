const express = require('express');
const Router = express.Router();
const db = require("../routes/db/index");


Router.get('/',  async function(req, res, next) {
    try {
      const results = await db.query("SELECT * FROM reflection LIMIT 10");
      return res.json(results.rows);
    } catch (err) {
      return next(err);
    }
  });

Router.post('/',async function(req, res, next) {
    try {
      const result = await db.query(
        "INSERT INTO reflection (id, location, name, take_away) VALUES($1, $2, $3, $4) RETURNING *",
       [ req.body.id,
        req.body.location,
      req.body.name,
      req.body.take_away,
       ]
      );
      return res.json(result.rows[0]);
    } catch (err) {
      return next(err);
    }
  });

Router.get('/search', async function(req, res, next){
  try {
  const sql = "SELECT location, name, id FROM reflection WHERE to_tsvector(location || '' || name ) @@ to_tsquery('\english', $1)";
  const params = [search_term];
    const results = await db.query(sql, params);
    return res.json(results.rows[0]);
  } catch(err){
    return next(err)
  }
});
Router.get('/:passenId', async function(req, res, next) {
    try {
      const results = await db.query("SELECT * FROM reflection WHERE id = $1", [req.params.passenId]);
      return res.json(results.rows[0]);
    } catch (err) {
      return next(err);
    }
  });

Router.patch('/:passenId', async function(req, res, next) {
    try {
        const result = await db.query(
            "UPDATE reflection SET location=$1, namw=$2, take_away=$3  WHERE id=$4 returning *",
           [ req.body.location,
          req.body.name,
          req.body.take_away,
          req.params.passenId
           ]
          );
      return res.json(result.rows[0]);
    } catch (err) {
      return next(err);
    }
  });

Router.delete('/:passenId', async function(req, res, next) {
    try {
      const result = await db.query("DELETE FROM reflection WHERE id=$1", [
        req.params.passenId
      ]);
      return res.json({ message: "Deleted" });
    } catch (err) {
      return next(err);
    }
  });




module.exports = Router;




    