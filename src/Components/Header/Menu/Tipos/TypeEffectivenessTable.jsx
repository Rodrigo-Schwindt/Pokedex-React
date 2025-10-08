import { useEffect, useState } from "react";
import "./TypeEffectivenessTable.css";

export function TypeEffectivenessTable() {
    const [types, setTypes] = useState([]);
    const [typeData, setTypeData] = useState({});

    useEffect(() => {
        const fetchTypes = async () => {
            try {
                const res = await fetch("https://pokeapi.co/api/v2/type");
                const json = await res.json();
                const validTypes = json.results.slice(0, 18); 

                const damageData = {};
                await Promise.all(validTypes.map(async (type) => {
                    const res = await fetch(type.url);
                    const json = await res.json();
                    damageData[type.name] = json.damage_relations;
                }));

                setTypes(validTypes);
                setTypeData(damageData);
            } catch (err) {
                console.error(err);
            }
        };

        fetchTypes();
    }, []);

    const getEffectiveness = (atkType, defType) => {
        const relations = typeData[atkType];
        if (!relations) return "";

        if (relations.no_damage_to.some(t => t.name === defType)) return "0";
        if (relations.half_damage_to.some(t => t.name === defType)) return "½";
        if (relations.double_damage_to.some(t => t.name === defType)) return "2";
        return "";
    };
    
    const typeColors = {
        normal: "#A8A77A",
        fire: "#EE8130",
        water: "#6390F0",
        electric: "#F7D02C",
        grass: "#7AC74C",
        ice: "#96D9D6",
        fighting: "#C22E28",
        poison: "#A33EA1",
        ground: "#E2BF65",
        flying: "#A98FF3",
        psychic: "#F95587",
        bug: "#A6B91A",
        rock: "#B6A136",
        ghost: "#735797",
        dragon: "#6F35FC",
        dark: "#705746",
        steel: "#B7B7CE",
        fairy: "#D685AD",
    };

    return (
        <div className="type-table-wrapper">
            <table className="type-table">
            <thead>
                <tr>
                    <th>ATK ↓ / DEF →</th>
                    {types.map((type) => (
                        <th
                            key={type.name}
                            style={{ backgroundColor: typeColors[type.name], color: "white" }}
                        >
                            {type.name.substring(0, 3).toUpperCase()}
                        </th>
                    ))}
                </tr>
            </thead>
                <tbody>
                    {types.map((atk) => (
                        <tr key={atk.name}>
                            <td style={{ backgroundColor: typeColors[atk.name], color: "white" }}>
                {atk.name.toUpperCase()}
                            </td>
                            {types.map((def) => (
                <td
                    key={`${atk.name}-${def.name}`}
                    className={`cell cell-${getEffectiveness(atk.name, def.name)}`}
                >
                    {getEffectiveness(atk.name, def.name)}
                </td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}