const db = require('../routes/db/Helper');
const Helper = require('../routes/db/userhelp');
const express = require('express');
const Router = express.Router();
const  bcrypt = require('bcrypt');
const  jwt = require('jsonwebtoken');

Router.post('/signin', async function(req,res){
  if (!req.body.email || !req.body.password) {
    return res.status(400).send({'message': 'Some values are missing'});
  }
  function isValidEmail(email) {
    return /\S+@\S+\.\S+/.test(email);
  };
  if (!isValidEmail(req.body.email)) {
    return res.status(400).send({ 'message': 'Please enter a valid email address' });
  }
  try {
    const text = 'SELECT * FROM person WHERE email = $1';
    const result = await db.query(text, [req.body.email]);
     res.json(result.rows[0]);
    if (result.rows[0]) {
      return res.status(400).send({'message': 'mail exist'});
    }
    else{
     const hashedPassword = await bcrypt.hash(req.body.password, 10);
    const result = await db.query( "INSERT INTO person ( email, password) VALUES ($1,$2) RETURNING *",
     [req.body.email, hashedPassword]
    );
    return res.json(result.rows[0]);
   }
  }catch(error) {
    return res.status(400).send(error)
  }
});
Router.post('/signup',async function(req, res){
  if (!req.body.email || !req.body.password) {
    return res.status(400).send({'message': 'Some values are missing'});
  }
  function isValidEmail(email) {
    return /\S+@\S+\.\S+/.test(email);
  };
  if (!isValidEmail(req.body.email)) {
    return res.status(400).send({ 'message': 'Please enter a valid email address' });
  }
  function hashedPassword(password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(10))
  };
  const hashPassword = hashedPassword(req.body.password);

  const createQuery = 'INSERT INTO person (id, email, password) VALUES($1, $2, $3) returning *';
  const values = [req.body.id, req.body.email, hashPassword];

  try {
    const { rows } = await db.query(createQuery, values);
    function generateToken(id) {
      const token = jwt.sign({
        userId: id
      },
        process.env.SECRET, { expiresIn: '7d' }
      );
      return token;
    };
    const token = generateToken(rows[0].id);
    return res.status(201).send({ token });
  } catch(error) {
    if (error.routine === '_bt_check_unique') {
      return res.status(400).send({ 'message': 'User with that EMAIL already exist' })
    }
    return res.status(400).send(error);
  }
});

Router.post('/login', async function(req, res){
  if (!req.body.email || !req.body.password) {
    return res.status(400).send({'message': 'Some values are missing'});
  }
  function isValidEmail(email) {
    return /\S+@\S+\.\S+/.test(email);
  };
  if (!isValidEmail(req.body.email)) {
    return res.status(400).send({ 'message': 'Please enter a valid email address' });
  }
  const text = 'SELECT * FROM person WHERE email = $1';
  try {
    const { rows } = await db.query(text, [req.body.email]);
    if (!rows[0]) {
      return res.status(400).send({'message': 'The credentials you provided is incorrect'});
    }
    function comparePassword(hashPassword, password) {
      return bcrypt.compareSync(password, hashPassword);
    };
    if(!comparePassword(rows[0].password, req.body.password)) {
      return res.status(400).send({ 'message': 'The credentials you provided is incorrect' });
    }
    function generateToken(id) {
      const token = jwt.sign({
        userId: id
      },
        process.env.SECRET, { expiresIn: '7d' }
      );
      return token;
    }
    const token = generateToken(rows[0].id);
    return res.status(200).send({ token });
  } catch(error) {
    return res.status(400).send(error)
  }
});

Router.delete('/id', async function(req, res){
  const deleteQuery = 'DELETE FROM person WHERE id=$1 returning *';
    try {
      const { rows } = await db.query(deleteQuery, [req.params.id]);
      if(!rows[0]) {
        return res.status(404).send({'message': 'user not found'});
      }
      return res.status(204).send({ 'message': 'deleted' });
    } catch(error) {
      return res.status(400).send(error);
    }
});


module.exports = Router;
