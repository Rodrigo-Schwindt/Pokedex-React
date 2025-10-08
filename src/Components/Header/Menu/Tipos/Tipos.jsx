import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./Tipos.css"
import { TypeEffectivenessTable } from "./TypeEffectivenessTable";

export function Tipos() {

    const [data, setData] = useState([]);

    const CallAPI = async () => {
        try {
            const API_URL = `https://pokeapi.co/api/v2/type`;
            const response = await fetch(API_URL);
            const json = await response.json();

            setData(json.results);
        }
        catch (error) {
            console.error(error);
        }
    }

    useEffect(() => {
        CallAPI();
    }, []);

    const totalType = data.slice(0,18);


    return (
        
            <section className="section-container">
                <Link className="back" to="/">Volver</Link>
                <div className="tipos">
                    {totalType.map((type) => {
                        const typeid = type.url.split('/')[6];
                        const url = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/types/generation-viii/sword-shield/${typeid}.png`;

                        return (
                            <Link to={`/types/${typeid}`} key={typeid}>
                                <div className="pokemon-types">
                                    <img src={url} alt={type.name} />
                                </div>
                            </Link>
                        )
                    })}
                    
                </div>
                <TypeEffectivenessTable />
                <nav className="img">
                    <img src="/terapagos.png" alt="imagen de fondo"/>
                </nav>
            </section>
    )
}

