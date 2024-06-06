import express from 'express';
import { appDataSource } from '../datasource.js';
import Movie from '../entities/movies.js';
const router = express.Router();
//import { Like } from "typeorm";

router.get('/:id', function (req, res) {
    appDataSource
    .getRepository(Movie)
    .find({
      where : {id: req.params}
    })
    .then(function (movies) {
      res.json({ movie: movies });
    }).catch(function (error) {
      res.status(404).json({ error: 'Not found!' });
    });
  });

export default router;