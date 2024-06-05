import logo from './logo.svg';
import './Home.css';
import { useState } from 'react';
import {useFetchMovies} from './useFetchMovies.jsx'
import Movie from '../../components/Movie/Movie.jsx';

function Home() {
  const [movie_name, set_movie_name] = useState('');
  const {movie_list} = useFetchMovies();
  console.log(movie_list);
  const listMovies = movie_list.map(movie => <Movie key={movie.id} data={movie}/>);
  
  return (
    <div className="App">
      <header className="App-header">
        <h1>Meilleur film de tous les temps</h1>
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.jsx</code> and save to reload.
        </p>
        <input name="Nom de Film" value={movie_name} onChange={e => set_movie_name(e.target.value)}/>
        <div>
          {listMovies}
        </div> 
        <a
          className="App-link"
          href="https://react.dev"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
        
      </header>
    </div>
  );
}

export default Home;
