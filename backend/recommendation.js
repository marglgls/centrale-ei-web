import express from 'express';
import Movie from './entities/movies.js';
import User from './entities/user.js';
import Genre from './entities/genre.js'
//const router = express.Router();
import { Like } from "typeorm";
import Rating from './entities/ratings.js';
import { appDataSource } from './datasource.js';


//await appDataSource.initialize();

async function rating_genres(userId){
    //await appDataSource.initialize();
    const result = await appDataSource.getRepository(Rating)
    .createQueryBuilder('rating')
    .innerJoinAndSelect('rating.movie', 'movie')
    .innerJoinAndSelect('movie.genres', 'genre')
    .select('genre.name', 'genre')
    .addSelect('SUM(rating.value)', 'total_rating')
    .where('rating.userId = :userId', { userId:userId })
    .groupBy('genre.name')
    .orderBy('total_rating', 'DESC')
    .getRawMany();
    //console.log(result);
    return result;
}

async function list_rating_movies(list_rating_genres){
    console.log('ok')
    
    const movie = appDataSource.getRepository(Movie)
    let list_movies = []
    let somme_notes = 0;
    for (let genre_rated of list_rating_genres){
        if (genre_rated.total_rating >0)
        {
            somme_notes = somme_notes + genre_rated.total_rating
        }
    }
    list_rating_genres.sort((a, b) => b.total_rating - a.total_rating);
    let i = 0;
    for (let genre_rated of list_rating_genres)
        {
            if (genre_rated.total_rating >0 && i < 50)
                {
                    const takenMovieIds = list_movies.map(movie => movie.id);
                    const nb = Math.ceil(genre_rated.total_rating/somme_notes*100);
                    //console.log(nb)
                    const new_movies = await movie
                    .createQueryBuilder('movie')
                    .innerJoin('movie.genres', 'genre')
                    //.innerJoin('movie.ratings', 'rating')
                    .where('genre.name = :genre', genre_rated )
                    .andWhere('movie.id NOT IN (:...ids)', { ids: takenMovieIds })
                    //.andWhere('rating.userId =:userId', { userId: 1 })
                    //.andWhere('rating.value >= 0')
                    .limit(nb)
                    .getMany();
                    console.log(new_movies.length);
                    list_movies = list_movies.concat(new_movies);
                    console.log(list_movies.length);
                    
                }
                i = i + 1;
            
        }

    
    const takenMovieIds = list_movies.map(movie => movie.id);
    /*const new_movies = //await appDataSource.getRepository(Movie)
            await movie
            .createQueryBuilder('movie')
            .innerJoin('movie.genres', 'genre')
            .where('movie.id NOT IN (:...ids)', { ids: takenMovieIds })
            .limit(0/*100 - list_movies.length)
            .getMany();
    //console.log(list_movies);
    list_movies = list_movies.concat(new_movies)*/
    list_movies.sort((a, b) => b.popularity - a.popularity);
    let list_id_movies = []
    for (let movie of list_movies){
        list_id_movies = list_id_movies.concat(movie.id);
    }
    console.log(list_id_movies.length);
    return (list_id_movies);
}

export async function get_recommendation (userId) {
    const res = await rating_genres(userId);
    //console.log(res);
    const result = await list_rating_movies(res);
    //console.log(result);
    console.log(result.length)
    console.log('fin');
    return result;
}

