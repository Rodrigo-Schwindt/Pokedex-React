import { Link, useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { NotFound } from "../../NotFound/NotFound";

export function Pokemon() {
    let { id } = useParams();
    const [data, setData] = useState(null);
    const [evolutions, setEvolutions] = useState([]);
    const [description, setDescription] = useState("");
    const [error, setError] = useState(false);

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
                console.log(json);

                const speciesResponse = await fetch(json.species.url);
                const speciesData = await speciesResponse.json();

                const flavorText = speciesData.flavor_text_entries.find(
                    (entry) => entry.language.name === "es"
                );
                setDescription(flavorText.flavor_text);

                const evolutionResponse = await fetch(speciesData.evolution_chain.url);
                const evolutionData = await evolutionResponse.json();

                const evoChain = [];
                let evoStage = evolutionData.chain;

                while (evoStage) {
                    const pokemonId = evoStage.species.url.split('/').slice(-2, -1)[0];
                    evoChain.push({
                        name: evoStage.species.name,
                        url: `https://pokeapi.co/api/v2/pokemon/${evoStage.species.name}`,
                        imageUrl: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${pokemonId}.png`,
                    });
                    evoStage = evoStage.evolves_to[0];
                }
                setEvolutions(evoChain);
            } catch (error) {
                console.error(error);
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
            {Object.keys(data).length > 0 && (
                <div>
                    <h1>{data.name}</h1>
                    
                    <p>{description}</p>

                    <img src={data.sprites?.other?.["official-artwork"]?.front_default} alt={data.name} />
                    <h2>Numero: {data.id}</h2>
                    <h2>Altura: {data.height}</h2>
                    <h2>Peso: {data.weight}</h2>
                    <p>{data.types?.map((type) => type.type.name).join(", ")}</p>
                    <p>{data.abilities?.map((ability) => ability.ability.name).join(", ")}</p>
                    <div className="stats">
                        {data.stats.map((stat) => (
                            <div key={stat.stat.name}>
                                <p>{stat.stat.name}</p>
                                <p>{stat.base_stat}</p>
                            </div>
                        ))}
                    </div>

                    <h2>Evoluciones:</h2>
                    <div className="evolutions">
                        {evolutions.length > 1 ? (
                            evolutions.map((evo, index) => (
                                <div key={index}>
                                    <p>{evo.name}</p>
                                    <Link to={`/pokemon/${evo.name}`}>
                                        <img src={evo.imageUrl} alt={evo.name} width="100" />
                                    </Link>
                                </div>
                            ))
                        ) : (
                            <p>Este Pokémon no evoluciona.</p>
                        )}
                    </div>

                    <div className="moves">
                        {data.moves
                            ?.map((move) => {
                                const levelDetail = move.version_group_details.find(
                                    (detail) => detail.level_learned_at > 0
                                );
                                return levelDetail
                                    ? { name: move.move.name, level: levelDetail.level_learned_at }
                                    : null;
                            })
                            .filter(Boolean)
                            .sort((a, b) => a.level - b.level)
                            .map((move) => (
                                <p key={move.name}>
                                    {move.name} (Nivel {move.level})
                                </p>
                            ))}
                    </div>

                    <Link to="/">Volver</Link>
                </div>
            )}
        </>
    );
}