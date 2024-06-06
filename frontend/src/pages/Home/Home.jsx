import logo from './logo.svg';
import './Home.css';
import axios from 'axios';
import { useEffect, useState } from 'react';
//import { useFetchMovies } from './useFetchMovies.jsx'
import Movie from '../../components/Movie/Movie.jsx';

function Home() {
  const [movieTitle, setMovieTitle] = useState('');
  const [page, setPage] = useState(1);
  const [movieList, setMovieList] = useState([]);

  //const { movieList } = useFetchMovies(page);

  //const listMovies = movieList.map(movie => <Movie key={movie.id} data={movie}/>);
  
  const modifyPage = (c) => {
    if (1 <= page + c ) {
      setPage(page + c);
    }
  }  

  // Fetch a page of movies on TMDB
  useEffect(() => {
    axios
  .get(`https://api.themoviedb.org/3/movie/popular?language=en-US&page=${page}`, {headers: {
    accept: 'application/json',
    Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIxZjlmNjAwMzY4MzMzODNkNGIwYjNhNzJiODA3MzdjNCIsInN1YiI6IjY0NzA5YmE4YzVhZGE1MDBkZWU2ZTMxMiIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.Em7Y9fSW94J91rbuKFjDWxmpWaQzTitxRKNdQ5Lh2Eo'
  }})
  .then((response) => {
		setMovieList(response.data.results);
    console.log(response.data.results);
  })
  .catch((error) => {
		// Do something if call failed
		console.log(error)
  });
  }, [page]);


  // Fetch by title

  useEffect(() => {
    if (movieTitle == '') {
      // Reset page to initial one
      setPage(1);
    } else {
          axios
      .get(`http://localhost:8000/search/${movieTitle}}`)
      .then((response) => {
        setMovieList(response.data.results);
        console.log(response.data.results);
      })
      .catch((error) => {
        // Do something if call failed
        console.log(error)
  });
    }
  },[movieTitle]);



  return (
    <div className="App">
        <h1>CINEMATICS</h1>
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Qu'allez-vous regarder aujourd'hui ? 
        </p>
        <input placeholder="Rechercher un film" value={movieTitle} onChange={e => setMovieTitle(e.target.value)}/>
        <div className="movie-container">
          {movieList.map(movie => <Movie key={movie.id} data={movie}/>)}
        </div> 
        <div className="footer">
          {page !==1 && (<button id="pageMinus" onClick={()=>{modifyPage(-1)}}> &#60; Page précédente </button>)} | <button id="pagePlus" onClick={()=>{modifyPage(1)}}> Page suivante &#62; </button>
        </div>
    </div>
  );
}


export default Home;
