import express from 'express';
import { appDataSource } from '../datasource.js';
import Movie from '../entities/movies.js';
const router = express.Router();
import { Like } from "typeorm";

router.get('/', function (req, res) {
    appDataSource
      .getRepository(Movie)
      .find({order: { popularity: 'DESC' } })
      .then(function (movies) {
        res.json({ movies: movies });
      });
  });

router.get('/id', function (req, res) {
    appDataSource
    .getRepository(Movie)
    .find({
        where: {
        id: req.params.movieId
        },
    })
    .then(function (movies) {
        if (movies == {}){
            console.error(error);
            res.status(404).json({
            message: `Not found`,
          });
        }
        res.status(201).json({
          message: 'Movie successfully found',
          id: movie.id,
          name : movie.name
        });
      })
      .catch(function (error) {
        console.error(error);
          res.status(404).json({
            message: `Not found`,
          });
      });
});

router.post('/new', function (req, res) {
    const movieRepository = appDataSource.getRepository(Movie);
    const newMovie = movieRepository.create({
      title: req.body.title,
      release_date: req.body.release_date,
  });
  
  movieRepository
    .save(newMovie)
    .then(function (savedMovie) {
      res.status(201).json({
        message: 'Movie successfully created',
        id: savedMovie.id,
      });
    })
    .catch(function (error) {
      console.error(error);
      if (error.code === '23505') {
        res.status(400).json({
          message: `Movie "${newMovie.name}" already exists`,
        });
      } else {
        res.status(500).json({ message: 'Error while creating the movie' });
      }
    });
});

router.delete('/id', function (req, res) {
    appDataSource
      .getRepository(Movie)
      .delete({ id: req.body.id })
      .then(function (result) {
        if(result.affected == 0) {
            res.status(404).json({ message: 'Movie not found' });
        } else {
            appDataSource.getRepository(Movie).delete({ id: req.body.id });
            res.status(200).json({ message: 'Movie successfully deleted' });
        }
      })
      .catch(function () {
        res.status(404).json({ message: 'Error while deleting the user' });
      });
  });


  router.get('/page/:number_page', function (req, res) {
    const page = parseInt(req.params.number_page, 10);
    const moviesPerPage = 20;
    const skip = (page - 1) * moviesPerPage;
    appDataSource
      .getRepository(Movie)
      .find({
        order: { popularity: 'DESC' },
        skip: skip,
        take: moviesPerPage,
       })
      .then(function (movies) {
        res.json({ movies: movies });
      });
  });


  router.get('/search/:title', function (req, res) {
    //console.log(req);
    appDataSource
    .getRepository(Movie)
    .find({
      where : {title: Like(`%${req.params.title}%`)}, 
      order: { popularity: 'DESC' } 
    })
    .then(function (movies) {
      res.json({ movies: movies });
    }).catch(function (error) {
      res.status(404).json({ error: 'Not found!' });
    });
}
  );




export default router;