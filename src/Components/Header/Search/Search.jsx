import { useState } from "react";
import "./Search.css";
import { SiPokemon } from "react-icons/si";
import { Link } from "react-router-dom";

export function Search({ sendSearch }) {  
    const [search, setSearch] = useState('');

    const changeSearch = (e) => { 
        e.preventDefault();  
        sendSearch(search.toLowerCase());  
    };

    return (
        <>
        <Link to="/">
        <SiPokemon className="pokemon-icon" />
        </Link>
        <form className="search" onSubmit={(e) => changeSearch(e)}>
            <input 
                onChange={(e) => setSearch(e.target.value)} 
                type="text" 
                placeholder="Buscar Pokémon" 
                className="searcher"
            />
            <button type="submit">Buscar</button> 
        </form>
        </>
    );
}