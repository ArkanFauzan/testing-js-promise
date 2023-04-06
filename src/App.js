import {useEffect, useState} from 'react';
import axios from 'axios';

import './App.css';

function App() {

  const [movie, setMovie] = useState([]);

  /**
   * Async function always return promise
   * 
   * Promise intinya bisa berhasil bisa gagal (resolve/reject)
   * 
   * await hanya bisa digunakan di dalam async function
   * await maksudnya nunggu dulu hasilnya, baru bisa ke step berikutnya
   */
  const getDataMovie = async () => {
    try {
      const response = await axios.get('https://api.themoviedb.org/3/trending/movie/week?api_key=c080aa2cf42eefaeaec79535801c23cc');

      console.log({iniDataListMovie : response.data.results}); // ini wujudnya array of object (berisi data2 list movie)

      // movieWithCredits akan berisi promise [promise, promise, promise, dan lain lain]
      // kenapa ? karena  response.data.results.map(async (val)=>{}) ADA ASYNC DISITU
      // Async function always return promise
      // Maka, meskipun di dalem map nya ada return val
      // tetap saja movieWithCredits akan menjadi array of promise
      const movieWithCredits = response.data.results.map(async (val)=>{
        try {
          const resCredits = await axios.get(`https://api.themoviedb.org/3/person/${val.id}?api_key=c080aa2cf42eefaeaec79535801c23cc`);
          val.name = resCredits.data.name;
        } catch (error) {
          val.name = '- (not found)'; // movie credits tidak ditemukan, nama director di kosongkan saja
        }
        return val;
      });

      console.log({iniArrayOfPromise : movieWithCredits}); // array of promise
      
      // ini untuk eksekusi semua promise nya
      let resultMovieWithCredits = await Promise.all(movieWithCredits);

      console.log({iniSudahJadiHasil : resultMovieWithCredits}); // udah jadi hasilnya

      setMovie(resultMovieWithCredits);

    } catch (error) {
      console.log('error get list movie');
    }

  }

  useEffect(()=>{
    getDataMovie();
  },[]);

  return (
    <>
      <h1>Testing hit api aafter get response</h1>
      {movie.map((data, idx)=>{
        return (
          <div key={idx} style={{width: '200px', display: 'inline-block', margin: '10px', border: '1px solid black'}}>
            <p>Title : {data.title}</p>
            <p>Director (api misah) = {data.name}</p>
          </div>
        )
      })}
    </>
  );
}

export default App;
