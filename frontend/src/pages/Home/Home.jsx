import logo from './logo.svg';
import './Home.css';
import axios from 'axios';
import { useEffect, useState } from 'react';
import Movie from '../../components/Movie/Movie.jsx';

function Home() {

  const [movieTitle, setMovieTitle] = useState('');
  const [page, setPage] = useState(1);
  const [movieList, setMovieList] = useState([]);
  const [userId, setUserId] = useState(1);
  const [recomBool,setRecomBool] = useState(false);
  
  const modifyPage = (c) => {
    if (1 <= page + c ) {
      setPage(page + c);
    }
  }  

  // Fetch a page of movies on the database
  useEffect(() => {
  if (recomBool == false) {
    axios
  .get(`http://localhost:8000/movies/page/${page}`)
  .then((response) => {
    console.log("popular");
    console.log(response.data.movies);
		setMovieList(response.data.movies);
  })
  .catch((error) => {
		// Do something if call failed
		console.log(error)
  });
  }
  }, [page,recomBool]);


  // Fetch by title

  useEffect(() => {
    if (movieTitle == '') {
      // Reset page to initial one
        axios
      .get(`http://localhost:8000/movies/page/1`)
      .then((response) => {
        setPage(1);
        setMovieList(response.data.movies);
      })
      .catch((error) => {
        // Do something if call failed
        console.log(error)
  });
    } else {
      console.log(movieTitle);
        axios
      .get(`http://localhost:8000/movies/search/${movieTitle}`)
      .then((response) => {
        setMovieList(response.data.movies);
        console.log(response.data.movies);
      })
      .catch((error) => {
        // Do something if call failed
        console.log(error)
  });
    }
  },[movieTitle]);

    // Use recommandation algorithm

    

    const toggleBool = () => {
      if (recomBool == true) {
        setRecomBool(false);
        setPage(1);
      } else {
        setRecomBool(true);
      }
    }
    
    useEffect(() => {
      console.log('Recommand :', recomBool);
      if (recomBool == true) {
        axios
  .get(`http://localhost:8000/ratings/recommend/${userId}`)
  .then((response) => {
    console.log(response.data);
		setMovieList(response.data.movies);
  })
  .catch((error) => {
		// Do something if call failed
		console.log(error)
  })
      }
    }, [recomBool]);

  return (
    <div className="App">
        <h1>CINEMATICS</h1>
        <img src={logo} className="App-logo" alt="logo" />
        <div> Affichage personnalisé : <input type="checkbox" onChange={()=>{toggleBool()}} checked={recomBool}></input></div>
        <p>
          Qu'allez-vous regarder aujourd'hui ? 
        </p>
        <input className="search-bar" placeholder="Rechercher un film" value={movieTitle} onChange={e => setMovieTitle(e.target.value)}/>
        <div className="movie-container">
          {movieList.map(movie => <Movie key={movie.id} data={movie}/>)}
        </div> 
        {movieTitle == '' &&
        (<div className="footer">
          {(page !== 1) && (<button className="previous-page-button" id="pageMinus" onClick={()=>{modifyPage(-1)}}> </button>)} &nbsp; <button className="next-page-button" id="pagePlus" onClick={()=>{modifyPage(1)}}> </button>
        </div>)}
    </div>
  );
}


export default Home;
