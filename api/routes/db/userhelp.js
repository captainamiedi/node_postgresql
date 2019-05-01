const express = require('express');
const Router = express.Router();
const  bcrypt = require('bcrypt');
const  jwt = require('jsonwebtoken');

 /**
   * Hash Password Method
   * @param {string} password
   * @returns {string} returns hashed password
   */
  function hashPassword(password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8))
  };
  /**
   * comparePassword
   * @param {string} hashPassword 
   * @param {string} password 
   * @returns {Boolean} return True or False
   */
  function comparePassword(hashPassword, password) {
    return bcrypt.compareSync(password, hashPassword);
  };
  /**
   * isValidEmail helper method
   * @param {string} email
   * @returns {Boolean} True or False
   */
  function isValidEmail(email) {
    return /\S+@\S+\.\S+/.test(email);
  };
  /**
   * Gnerate Token
   * @param {string} id
   * @returns {string} token
   */
  function generateToken(id) {
    const token = jwt.sign({
      userId: id
    },
      process.env.SECRET, { expiresIn: '7d' }
    );
    return token;
  }


module.exports = Router;
