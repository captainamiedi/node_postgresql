const express = require('express');
const Router = express.Router();



Router.get('/',async (req, res, next) => {
    try {
      const result = await db.query("SELECT * FROM graduates");
      return res.json(result.rows);
    } catch (e) {
      return next(e);
    }
  });

Router.post('/', (req, res, next)=>{
    const ridersDetails = {
        name: req.body.name,
        class: req.body.class
    };
    res.status(201).json({
        message: 'handling posted passengers',
        createdRiders: ridersDetails
    });
});

Router.get('/:riderId', (req, res, next)=>{
    const Id = req.params.Id;
    res.status(200).json({
        message: 'rides details'
    });
});
Router.delete('/:riderId', (req, res, next)=>{
    const Id = req.params.Id;
    res.status(200).json({
        message: 'rides details'
    });
});


module.exports = Router;