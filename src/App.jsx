import { NotFound } from './Components/NotFound/NotFound';
import { Header } from './Components/Header/Header';
import { ListPokemon } from './Components/ListPokemon/ListPokemon';
import { Pokemon } from './Components/ListPokemon/Pokemon/Pokemon';
import {  Routes, Route } from 'react-router-dom';
import { Img_fondo } from './Components/Img_fondo/Img_fondo';

function App() {

  return (
    <>
      <Img_fondo />
      <Header />

      <Routes>
        <Route path="*" element={<NotFound />} />
        <Route path="/pokemon/:id" element={<Pokemon />} />
        <Route path="/" element={<ListPokemon />} />
      </Routes>
    </>
  )
}

export default App
