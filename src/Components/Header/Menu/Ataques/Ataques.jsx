import { useEffect, useState, useRef } from "react";
import { Link } from "react-router-dom";
import "./Ataques.css";

export function Ataques() {
  const [datosMoves, setDatosMoves] = useState([]);
  const [hasMore, setHasMore] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  const cantAtaques = 20;
  const offsetRef = useRef(0);
  const elementRef = useRef(null);

  const CallAPI = async () => {
    if (isLoading || !hasMore) return; 
    setIsLoading(true);

    try {
      const API_URL = `https://pokeapi.co/api/v2/move/?offset=${offsetRef.current}&limit=${cantAtaques}`;
      const response = await fetch(API_URL);
      const json = await response.json();

      if (json.results.length === 0) {
        setHasMore(false);
        setIsLoading(false);
        return;
      }

      offsetRef.current += cantAtaques;


      const movesData = await Promise.all(
        json.results.map(async (move) => {
          const moveResponse = await fetch(move.url);
          const moveDetail = await moveResponse.json();

          const flavorText = moveDetail.flavor_text_entries.find(
            (entry) => entry.language.name === "es"
        )?.flavor_text ?? "No disponible";

          return {
            name: moveDetail.name,
            power_type: moveDetail.damage_class?.name ?? "N/A",
            accuracy: moveDetail.accuracy ?? "N/A",
            type: moveDetail.type?.name ?? "N/A",
            power: moveDetail.power ?? "N/A",
            description: flavorText,
          };
        })
      );

      setDatosMoves((prevMoves) => [...prevMoves, ...movesData]);
    } catch (error) {
      console.error(error);
    }

    setIsLoading(false);
    };


    useEffect(() => {
      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting && hasMore && !isLoading) {
            CallAPI();
          }
        },
        {
            root: null,
            rootMargin: "100px",
            threshold: 0.1,
        }
      );
    
      if (elementRef.current) observer.observe(elementRef.current);
    
      return () => observer.disconnect();
    }, [hasMore, isLoading]);


  
    return (
        <section className="ataques-section"> 
          <Link className="back" to="/">Volver</Link>
          <div>
              <div className="moves-header">
                <h2>Movimientos</h2>
                <h2>Tipo</h2>
                <h2>Daño</h2>
                <h2>Precisión</h2>
                <h2>Tipo de daño</h2>
                <h2 className="desc">Description</h2>
              </div>
          
            {datosMoves.map((move, index) => (
              <div className="move-move" key={move.name + index}>
                <p>{move.name.replace(/-/g, " ")}</p>
                <p>{move.type}</p>
                <p>{move.power}</p>
                <p>{move.accuracy}</p>
                <p>{move.power_type}</p>
                <p className="desc">{move.description}</p>              
              </div>
            ))}
          </div>
          <div ref={elementRef}>
                  {hasMore && isLoading && <p className="load">Cargando más movimientos...</p>}
          </div>
          
        </section>
    );
}