import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import "./ListPokemon.css";

export function ListPokemon() {
  const [data, setData] = useState([]);
  const [hasMore, setHasMore] = useState(true);
  const cantPkm = 20;

  const offsetRef = useRef(0);
  const elementRef = useRef(null);

  const CallAPI = async () => {
    try {
      const API_URL = `https://pokeapi.co/api/v2/pokemon?limit=${cantPkm}&offset=${offsetRef.current}`;
      const response = await fetch(API_URL);
      const json = await response.json();

      if (json.results.length === 0) {
        setHasMore(false);
      } else {
        setData((prevData) => [...prevData, ...json.results]);
        offsetRef.current += cantPkm;
      }
    } catch (error) {
      console.error(error);
    }
  };

  const onIntersect = ([entry]) => {
    if (entry.isIntersecting && hasMore) CallAPI();
  };

  useEffect(() => {
    const observer = new IntersectionObserver(onIntersect);
    if (elementRef.current) observer.observe(elementRef.current);

    return () => observer.disconnect();
  }, []);

  return (
    <main id="pokedex">
      {data.map((pokemon) => {

        const id = pokemon.url.split("/")[6];
        const img = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${id}.png`;

        return (
          <Link to={`/pokemon/${id}`} className="btn">

            <div className="pkm" key={pokemon.url}>
              <img src={img} alt={pokemon.name.replace(/-/g, " ")} />
              <div className="info">
                <p className="id">{id}</p>
                <p>{pokemon.name}</p>
              </div>
            </div>

          </Link>
      
        );
      })}

      <div ref={elementRef}>
        {hasMore && <p>Cargando...</p>}
      </div>
    </main>
  );
}