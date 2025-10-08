import "./ItemsPkm.css";
import { Link } from "react-router-dom";
import { useState, useEffect, useRef} from "react";


export function ItemsPkm() {

    const [data, setData] = useState({ results: [] });
    const [description, setDescription] = useState({});
    const [showDescriptions, setShowDescriptions] = useState({});
    const [hasMore, setHasMore] = useState(true);
    const [isLoading, setIsLoading] = useState(false);

    const cantItems = 20;
    const elementRef = useRef(null)
    const itemsContainerRef = useRef(null);
    const offsetRef = useRef(0);

    const CallAPI = async () => {

        if (isLoading || !hasMore) return; 
        setIsLoading(true);

        try{    
            const response = await fetch(`https://pokeapi.co/api/v2/item/?offset=${offsetRef.current}&limit=${cantItems}`);
            const json = await response.json();

            if (json.results.length === 0) {
                setHasMore(false);
                setIsLoading(false);
                return;
              }

            offsetRef.current += cantItems;

            const descriptionsData = {};
            await Promise.all(json.results.map(async (item) => {
                const resultsResponse = await fetch(item.url)
                const resultsData = await resultsResponse.json();
                
                const flavorText = resultsData.flavor_text_entries.find(
                    (entry) => entry.language.name === "es"
                );
                descriptionsData[item.name] = flavorText?.text || "Descripción no disponible";
                })
            );
            
            setData(prevData => ({
                ...json,
                results:[...prevData.results, ...json.results],
            }));

            setDescription(prev => ({
                ...prev,
                ...descriptionsData,
            }));

        }
        catch (error) {
            console.error(error);
        };

        setIsLoading(false);        
    }

    useEffect(() => {
        CallAPI();
    }, []);

    const toggleDescription = (name) => {
        setShowDescriptions((prev) => ({
            ...prev,
        [name]: !prev[name],
        }));
    }

    useEffect(() => {
        const observer = new IntersectionObserver(
          ([entry]) => {
            if (entry.isIntersecting && hasMore && !isLoading) {
              CallAPI();
            }
          },
          {
              root: null,
              rootMargin: "5px",
              threshold: 0.1,
          }
        );
      
        if (elementRef.current) observer.observe(elementRef.current);
      
        return () => observer.disconnect();
      }, [hasMore, isLoading]);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (itemsContainerRef.current && !itemsContainerRef.current.contains(event.target)) {
                setShowDescriptions({});
            }
        };
        document.addEventListener("click", handleClickOutside);
        return () => {
            document.removeEventListener("click", handleClickOutside);
        };
    }, []);

    

    return (
        <section className="section-container">
            <Link className="back" to="/">Volver</Link>
            <div className="items" ref={itemsContainerRef}>
                {data?.results?.map((item) => {
                    const name = item.name;
                 return (
                        <div onClick={() => toggleDescription(name)} className="item" key={name}>
                            <p className="name-item">{item.name.replace(/-/g, " ")}</p>
                            <img src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/${name}.png`}/>
                            <p  className={`description-item ${showDescriptions[name] ? "show" : ""}`}>
                            {description[name] }
                            </p>
                        </div>
                    )})}

            </div>
            <div ref={elementRef}>
                  {hasMore && isLoading && <p className="load">Cargando más Items...</p>}
            </div>
        </section>
    )
}