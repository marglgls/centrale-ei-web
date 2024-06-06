import { useParams } from 'react-router-dom';
import './DetailsMovie.css';
import axios from 'axios';
import { useState, useEffect } from 'react';
import { AiFillLike } from "react-icons/ai";
import { AiFillDislike } from "react-icons/ai";

function DetailsMovie(props) {
    const {idMovie} = useParams();
    const [movieData, setMovieData] = useState({});
    useEffect(() => {
        axios
      .get(`https://api.themoviedb.org/3/movie/${idMovie}`, {headers: {
        accept: 'application/json',
        Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIxZjlmNjAwMzY4MzMzODNkNGIwYjNhNzJiODA3MzdjNCIsInN1YiI6IjY0NzA5YmE4YzVhZGE1MDBkZWU2ZTMxMiIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.Em7Y9fSW94J91rbuKFjDWxmpWaQzTitxRKNdQ5Lh2Eo'
      }})
    // Fetch movie data for a given id

      .then((response) => {
        setMovieData(response.data);
        console.log(response.data);
      })
      .catch((error) => {
            console.log(error)
      });
      }, []);

      const [color, setColor] = useState('gray');

      const [colorD, setColorD] = useState('gray');
     
      const [valueLike, setValueLike] = useState(0);
      const handleClick = () => {
        if (valueLike != 0)
          {
            setValueLike(1);
          } else {
            setValueLike(0);
          }
        setColor(prevColor => (prevColor === 'gray' ? 'green' : 'gray'));
        setColorD(prevColor => (prevColor === 'red' ? 'gray' : 'gray'));
      };

      const handleClickD = () => {
        if (valueLike != 0)
          {
            setValueLike(-1);
          } else {
            setValueLike(0);
          }
        setColor(prevColor => (prevColor === 'green' ? 'gray' : 'gray'));
        setColorD(prevColor => (prevColor === 'gray' ? 'red' : 'gray'));
      };



    return (



      <div className="details" /*style={{backgroundImage:`url("https://image.tmdb.org/t/p/w500${movieData.backdrop_path}")`}*/>
        <div className="details-image-container">
          <img className="details-image" src={`https://image.tmdb.org/t/p/w500${movieData.poster_path}`} alt="img"/>
        </div>
        <div className="details-right-container">
          <div className="details-info-container">
            <span className="details-title"> {movieData.title} </span> <br/>
            <span className="details-date"> Date de sortie : {movieData.release_date} </span> <br/>
            <span className="details-genre"> 
              {movieData.genres?.map(genre => <span key={genre.id}> -{genre.name}- </span>)} </span> <br/>
            <span className="details-description"> <p>{movieData.overview}</p> </span> <br/>
            <span className="details-duration"> Durée : {movieData.runtime} min </span> <br/>
          </div>
          <div className="button-container">
            <button className="Like"><AiFillLike style={{ color: color, cursor: 'pointer' }} 
              onClick={handleClick} className="like-icon" size={30}/></button>
            <button className="Dislike"><AiFillDislike style={{ color: colorD, cursor: 'pointer' }} 
            onClick={handleClickD} className="dislike-icon" size={30}/></button>
          </div>
        </div>
      </div>



    );
  }
  
  export default DetailsMovie;

  {/*<span> Bugdet : ${movieData.budget}  </span> <br/>
        
        <span> Langue d'origine : {movieData.original_language} </span> <br/>
        
        

        <img src={`https://image.tmdb.org/t/p/w500${movieData.backdrop_path}`} alt="img"/>
    */}