import "./Img_fondo.css"
import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";

export function Img_fondo() {

        const [offset, setOffset] = useState(0);

        useEffect(() => {  
            const handleScroll = () => {
                setOffset(window.scrollY * 0.02);
            };

            window.addEventListener("scroll", handleScroll);
            return () => window.removeEventListener("scroll", handleScroll);
        }, []);

        const location = useLocation();
        const pokemonLocation = location.pathname.startsWith("/pokemon/");
    
    return (
        <>  
            <div className="header-bg"></div>
            {pokemonLocation?
                (
                <img src="/Hera.webp" alt="imagen de fondo" className="heracross" style={{ transform: `translateY(${offset}px)`, width: "12%" }} />
                ):(
                <img src="/heracross.png" alt="imagen de fondo" className="heracross" style={{ transform: `translateY(${offset}px)` }} />
                )
            }
            <img src="/rayquaza.webp" alt="imagen de fondo" className="rayquaza" />
            <img src="/gyraa.webp" alt="imagen de fondo" className="gyra" />
            <img src="/regigigass.webp" alt="imagen de fondo" className="regigigass" />
        </>  
    )   
}