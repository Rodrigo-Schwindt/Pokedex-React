import { NotFound } from './Components/NotFound/NotFound';
import { Header } from './Components/Header/Header';
import { ListPokemon } from './Components/ListPokemon/ListPokemon';
import { Pokemon } from './Components/ListPokemon/Pokemon/Pokemon';
import {  Routes, Route } from 'react-router-dom';
import { Img_fondo } from './Components/Img_fondo/Img_fondo';
import { Tipos } from './Components/Header/Menu/Tipos/Tipos';
import { Tipo } from './Components/Header/Menu/Tipos/Tipo/tipo';
import { Ataques } from './Components/Header/Menu/Ataques/Ataques';
import { ItemsPkm } from './Components/Header/Menu/ItemsPkm/ItemsPkm';

function App() {

  return (
    <>
      <Img_fondo />
      <Header />

      <Routes>
        <Route path="/" element={<ListPokemon />} />
        <Route path="/pokemon/:id" element={<Pokemon />} />
        <Route path="*" element={<NotFound />} />
        <Route path="/types" element={<Tipos />} />
        <Route path="/types/:typeid" element={<Tipo />} />
        <Route path="/ataques" element={<Ataques />} />
        <Route path="/items" element={<ItemsPkm />} />
      </Routes>
    </>
  )
}

export default App
