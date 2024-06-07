import express from 'express';
import { appDataSource } from '../datasource.js';
import Rating from '../entities/ratings.js';
import User from '../entities/user.js';
import Movie from '../entities/movies.js';
import { In } from 'typeorm';
import {get_recommendation} from '../recommendation.js';
const router = express.Router();



// Get the rating associated to an user and a movie
router.get('/user=:idUser&movie=:idMovie', function (req, res) {
    appDataSource
      .getRepository(Rating)
      .find({where : {
        "movie.id": req.params.idMovie,
        "user.id": req.params.idUser
        }})
      .then(function (ratings) {
        console.log("UserID :", req.params.idUser);
        console.log("MovieID :", req.params.idMovie);
        res.json({ rating: ratings });
      }).catch( (error) => {
        return res.status(404).json({ message: 'Rating not found' });
      });
  });

// Create a new rating for a specific user and movie (given in body)
router.post('/new', async function (req, res) {
    const { userId, movieId, value } = req.body;

    if (!userId || !movieId || value === undefined) {
        return res.status(400).json({ message: 'Missing required fields' });
    }

    const userRepository = appDataSource.getRepository(User);
    const movieRepository = appDataSource.getRepository(Movie);
    const ratingRepository = appDataSource.getRepository(Rating);

    const user = await userRepository.findOneBy({ id: userId });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const movie = await movieRepository.findOneBy({ id: movieId });
    if (!movie) {
      return res.status(404).json({ message: 'Movie not found' });
    }
    
    const newRating = ratingRepository.create({
      value: value,
      user: user,
      movie: movie,
    });

    ratingRepository
    .save(newRating)
    .then(function (savedRating) {
        res.status(201).json({
          message: 'Rating successfully created',
          id: savedRating.id,
        });
      })
      .catch(function (error) {
        console.error(error);
        if (error.code === '23505') {
          res.status(400).json({
            message: `Rating with id "${newRating.id}" already exists`,
          });
        } else {
          res.status(500).json({ message: 'Error while creating the rating' });
        }
      });
    });

// Change the value of a rating (id and value in the body)
router.put('/:id', async function (req, res) {
    const ratingId = parseInt(req.params.id);
    const { value } = req.body;

    if (!ratingId || isNaN(ratingId) || value === undefined) {
        return res.status(400).json({ message: 'Rating ID or value is missing' });
    }

    const ratingRepository = appDataSource.getRepository(Rating);
    const ratingToUpdate = await ratingRepository.findOneBy({id: ratingId});

    if (!ratingToUpdate) {
        return res.status(404).json({ message: 'Rating not found' });
    }

    ratingToUpdate.value = value;

    ratingRepository
    .save(ratingToUpdate)
    .then(function () {
        res.status(200).json({ message: 'Rating successfully updated', updatedRating: ratingToUpdate })
    })
    .catch(function () {
        res.status(500).json({ message: 'Error while updating the rating' });
      });
});

// Delete a rating 
router.delete('/:id',  function (req, res) {
    appDataSource
    .getRepository(Rating)
    .delete({ id: req.params.id })
    .then(function () {
      res.status(201).json({ message: 'Rating successfully deleted' });
    })
    .catch(function () {
      res.status(500).json({ message: 'Error while deleting the rating' });
    });
});


router.get('/recommend/:userId', async function (req, res) {
  const recommend_id_list = await get_recommendation(req.params.userId);
  console.log('taille ', recommend_id_list.length);
  appDataSource
      .getRepository(Movie)
      .find({
        where : {id : In(recommend_id_list)},
        order: { id: 'DESC' } })
      .then(function (movies) {
        res.json({ movies: movies });
      });
});



export default router;