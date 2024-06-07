import { useParams } from 'react-router-dom';
import './DetailsMovie.css';
import axios from 'axios';
import { useState, useEffect } from 'react';
import { AiFillLike } from "react-icons/ai";
import { AiFillDislike } from "react-icons/ai";

function DetailsMovie(props) {
    const idUser = 1;
    const {idMovie} = useParams();
    const [movieData, setMovieData] = useState({});
    const [idRating, setIdRating] = useState(0);

  
    useEffect(() => { /*
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
    }); */
    axios
    .get(`http://localhost:8000/movies/details/${idMovie}`)
    .then((response) => {
      //setPage(1);
      setMovieData(response.data.movie[0]);
      console.log(response.data);
    })
    .catch((error) => {
      // Do something if call failed
      console.log(error)
});
    }, []);

    
      const [valueLike, setValueLike] = useState(0);
      const colorLike_dict = {'1' : 'green', '0' : 'gray', '-1' : 'gray'}
      const colorDislike_dict = {'1' : 'gray', '0' : 'gray', '-1' : 'red'}
      const [colorLike, setColorLike] = useState('gray');
      const [colorDislike, setColorDislike] = useState('gray');

    // Ratings

    
      // Get the rating if it exists at initialisation of the page

     useEffect(() => {
      axios
    .get(`http://localhost:8000/ratings/user=${idUser}&movie=${idMovie}`)
    .then((response) => {
      if (response.data.rating.length > 0) {
        setIdRating(response.data.rating[0].id);
        setValueLike(response.data.rating[0].value);
      }
    })
    .catch((error) => {
          console.log(error)
    });
    }, [valueLike, idRating]);
  

  const handleClickLike = () => {
    if (valueLike == 1) { 
        // delete
        axios
    .delete(`http://localhost:8000/ratings/${idRating}`)
    .then(() => {
      setValueLike(0);
    })
    .catch((error) => {
          console.log(error)
    });
      } else if (valueLike == -1){
        // put 
        axios
        .put(`http://localhost:8000/ratings/${idRating}`,{
          "value":1
        })
        .then(() => {
          setValueLike(1);
        })
        .catch((error) => {
            console.log(error)
        });
      } else {
        // post (new)
        axios
    .post(`http://localhost:8000/ratings/new`, {
      "userId" : idUser, "movieId" : idMovie, "value": 1
    })
    .then(() => {
      setValueLike(1);
    })
    .catch((error) => {
          console.log(error)
    });
    }
  }

  const handleClickDislike = () => {
    if (valueLike == -1) {
      // delete     
      axios
    .delete(`http://localhost:8000/ratings/${idRating}`)
    .then(() => {
      setValueLike(0);
    })
    .catch((error) => {
          console.log(error)
    });
      } else if (valueLike == 1) {
      // put
      axios
        .put(`http://localhost:8000/ratings/${idRating}`,{
          "value":-1
        })
        .then(() => {
          setValueLike(-1);
        })
        .catch((error) => {
            console.log(error)
        });
      } else { 
      // post (new)
      axios
      .post(`http://localhost:8000/ratings/new`, {
        "userId" : idUser, "movieId" : idMovie, "value": -1
      })
      .then(() => {
        setValueLike(-1);
      })
      .catch((error) => {
        console.log(error)
      });
      }
  }

  useEffect(() => {
    console.log('valueLike =', valueLike);
    setColorLike(colorLike_dict[valueLike.toString()]);
    setColorDislike(colorDislike_dict[valueLike.toString()]);
  },[valueLike])

  useEffect(() => {
    console.log('idRating =', idRating);
  },[idRating])



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
            <button className="Like"><AiFillLike style={{ color: colorLike, cursor: 'pointer' }} 
              onClick={() => {handleClickLike()}} className="like-icon" size={30}/></button>
            <button className="Dislike"><AiFillDislike style={{ color: colorDislike, cursor: 'pointer' }} 
            onClick={() => {handleClickDislike()}} className="dislike-icon" size={30}/></button>
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