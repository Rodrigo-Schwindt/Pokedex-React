import { Link, useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { NotFound } from "../../NotFound/NotFound";
import "./Pokemon.css";

export function Pokemon() {
    let { id } = useParams();
    const [data, setData] = useState(null);
    const [evolutions, setEvolutions] = useState([]);
    const [description, setDescription] = useState("");
    const [datosMoves, setDatosMoves] = useState({});
    const [error, setError] = useState(false);
    const [generation, setGeneration] = useState("");

    useEffect(() => {
        const fetchData = async () => {
            setError(false);
            try {
                const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}`);
                if (!response.ok) {
                    setError(true);
                    setData(null);
                    return;
                }
                const json = await response.json();
                setData(json);

                const speciesResponse = await fetch(json.species.url);
                const speciesData = await speciesResponse.json();

                const flavorText = speciesData.flavor_text_entries.find(
                    (entry) => entry.language.name === "es"
                );
                setDescription(flavorText?.flavor_text || "Descripción no disponible");

                const evolutionResponse = await fetch(speciesData.evolution_chain.url);
                const evolutionData = await evolutionResponse.json();

                const evoChain = [];
                let evoStage = evolutionData.chain;

                while (evoStage) {
                    const pokemonId = evoStage.species.url.split("/").slice(-2, -1)[0];
                    evoChain.push({
                        name: evoStage.species.name,
                        url: `https://pokeapi.co/api/v2/pokemon/${evoStage.species.name}`,
                        imageUrl: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${pokemonId}.png`,
                    });
                    evoStage = evoStage.evolves_to[0];
                }

                setEvolutions(evoChain);

                const allMoves = {};

                const movesData = await Promise.all(
                    json.moves.map(async (move) => {
                        const moveResponse = await fetch(move.move.url);
                        const moveDetail = await moveResponse.json();

                        return move.version_group_details.map((detail) => ({
                            name: moveDetail.name,
                            power_type: moveDetail.damage_class.name,
                            accuracy: moveDetail.accuracy ?? "N/A",
                            type: moveDetail.type.name,
                            power: moveDetail.power ?? "N/A",
                            level: detail.level_learned_at,
                            generation_move: detail.version_group.name,
                            method: detail.move_learn_method.name,
                        }));
                    })
                );

                movesData.flat()
                    .filter(move => move.method !== "machine" && move.level > 0) 
                    .forEach((move) => {
                        if (!allMoves[move.generation_move]) {
                            allMoves[move.generation_move] = [];
                        }

                        const exists = allMoves[move.generation_move].some(
                            (m) => m.name === move.name && m.method === move.method
                        );

                        if (!exists) {
                            allMoves[move.generation_move].push(move);
                        }
                    });

                for (const gen in allMoves) {
                    allMoves[gen].sort((a, b) => a.level - b.level);
                }

                setDatosMoves(allMoves);
                const ultimaGeneracion = Object.keys(allMoves).at(-1);
                setGeneration(ultimaGeneracion);

            } catch (error) {
                console.error(error);
                setError(true);
            }
        };

        fetchData();

        return () => {
            setData(null);
            setEvolutions([]);
            setDescription("");
            setError(false);
        };
    }, [id]);

    if (error) return <NotFound />;
    if (!data) return <p className="loading">Cargando...</p>;

    return (
        <>
            <section className="pokemon">
                <h1 className="name">{data.name}</h1>

                <p className="description" dangerouslySetInnerHTML={{ __html: description.replace(/\n/g, "<br>") }} />
                <h2 className="idpkm">Número: {String(data.id).padStart(4, "0")}</h2>

                <div className="info">
                    <div className="pokemon-image-container">
                        <img
                            src={data.sprites?.other?.["official-artwork"]?.front_default}
                            alt={data.name}
                            className="pokemon-image"
                        />
                    </div>
                    <div className="pokemon-info">
                        <div>
                            <h2>Altura: {(data.height / 10).toFixed(1)} m</h2>
                            <h2>Peso: {(data.weight / 10).toFixed(1)} kg</h2>
                        </div>
                        {data.types?.map((type, index) => {
                            const typeId = type.type.url.split("/")[6];
                            const imgUrl = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/types/generation-viii/sword-shield/${typeId}.png`;

                            return (
                                <div key={index} className="pokemon-type">
                                    <img src={imgUrl} alt={type.type.name} />
                                </div>
                            );
                        })}
                        <ul className="abilities-list">
                            {data.abilities?.map((ability, index) => (
                                <li key={index} className={ability.is_hidden ? "hidden-ability" : "normal-ability"}>
                                    {ability.ability.name.replace(/-/g, " ")}{" "}
                                    {ability.is_hidden && "(Habilidad Oculta)"}
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                <div className="flex">
                    <div className="stats">
                        {data.stats.map((stat) => {
                            const porcentaje = (stat.base_stat / 255) * 100;
                            let color = "";

                            if (porcentaje <= 16) color = "tomato";
                            else if (porcentaje <= 39) color = "yellow";
                            else if (porcentaje <= 55) color = "chartreuse";
                            else color = "deepskyblue";

                            return (
                                <div key={stat.stat.name} className="stat">
                                    <div className="stat-potition">
                                        <p>{stat.stat.name}</p>
                                        <p>{stat.base_stat}</p>
                                        <progress value={stat.base_stat} max="255" style={{ accentColor: color }} />
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    <div className="selector-generation">
                        <label htmlFor="gen">Generación:</label>
                        <select className="gen" value={generation} onChange={(e) => setGeneration(e.target.value)}>
                            {Object.keys(datosMoves).map((gen) => (
                                <option className="gen" key={gen} value={gen}>
                                    {gen.replace(/-/g, " ").toUpperCase()}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>

                {datosMoves[generation] && (
                    <div>
                        <div className="moves">
                            <h2>Movimientos</h2>
                            <h2>Nivel</h2>
                            <h2>Tipo</h2>
                            <h2>Daño</h2>
                            <h2>Precisión</h2>
                            <h2>Tipo de daño</h2>
                        </div>
                        {datosMoves[generation].length > 0 ? (
                            datosMoves[generation].map((move, i) => (
                                <div className="move" key={i}>
                                    <p>{move.name.replace(/-/g, " ")}</p>
                                    <p>{move.level}</p>
                                    <p>{move.type}</p>
                                    <p>{move.power}</p>
                                    <p>{move.accuracy}</p>
                                    <p>{move.power_type}</p>
                                </div>
                            ))
                        ) : (
                            <p>No hay movimientos disponibles.</p>
                        )}
                    </div>
                )}

                <h2 className="evolutions">Evoluciones:</h2>
                <div className="evolutions">
                    {evolutions.length > 1 ? (
                        evolutions.map((evo, index) => (
                            <div key={index}>
                                <p>{evo.name}</p>
                                <Link to={`/pokemon/${evo.name}`}>
                                    <img src={evo.imageUrl} alt={evo.name} width="250" />
                                </Link>
                            </div>
                        ))
                    ) : (
                        <p>Este Pokémon no evoluciona.</p>
                    )}
                </div>

                <Link className="back" to="/">Volver</Link>
            </section>
        </>
    );
}

