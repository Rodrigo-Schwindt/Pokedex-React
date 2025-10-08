import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import "./Tipo.css"

export function Tipo() {

    const { typeid } = useParams();
    const [data, setData] = useState(null);

    const CallAPI = async () => {
        try { 
            const API_URL = `https://pokeapi.co/api/v2/type/${typeid}`;
            const response = await fetch(API_URL);
            const json = await response.json();

            setData(json);
        }
        catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        CallAPI();    
    }, []);
    
    if (!data || !data.damage_relations) {
        return <p className="loading">Cargando...</p>;
    }
    const url = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/types/generation-viii/sword-shield/${typeid}.png`;
    return (
            <section className="section-container">
                <Link className="back" to="/types">Volver</Link>

                <div className="tipo">
                <div>
                    <img src={url} alt={"hola"} className="img-tipo" />
                </div>
                <div className="container">
                    <div className="grid">

                        <div>
                            <h2 className="h2"> Ataque efectivo contra :</h2>
                            {data.damage_relations.double_damage_to?.map((type) => {
                                const id = type.url.split('/')[6];
                                const url = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/types/generation-viii/sword-shield/${id}.png`;
                                return (
                                    <div key={type.url} className="img-container">
                                        <img src={url} alt={"hola"} />
                                    </div>
                                )
                            })}
                        </div>
                        
                        <div>
                            <h2 className="h2"> Ataque poco efectivo contra :</h2>
                            {data.damage_relations.half_damage_to?.map((type) => {
                                const id = type.url.split('/')[6];
                                const url = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/types/generation-viii/sword-shield/${id}.png`;
                                return (
                                    <div key={type.url + "1"} className="img-container">
                                        <img src={url} alt={"hola"} />
                                    </div>
                                )
                            })}
                        </div>
                        
                        <div>
                            <h2 className="h2"> Defensa efectiva contra :</h2>
                            {data.damage_relations.half_damage_from?.map((type) => {
                                const id = type.url.split('/')[6];
                                const url = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/types/generation-viii/sword-shield/${id}.png`;
                                return (
                                    <div key={type.url + "2"} className="img-container">
                                        <img src={url} alt={"hola"} />
                                    </div>
                                )
                            })}
                        </div>
                        
                        <div>
                            <h2 className="h2"> Defensa poco efectiva contra :</h2>
                            {data.damage_relations.double_damage_from?.map((type) => {
                                const id = type.url.split('/')[6];
                                const url = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/types/generation-viii/sword-shield/${id}.png`;
                                return (
                                    <div key={type.url + "3"} className="img-container">
                                        <img src={url} alt={"hola"} />
                                    </div>
                                )
                            })}
                        </div>
                    </div>
                </div>
                </div>
            </section >
        
    )
}