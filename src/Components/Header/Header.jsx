import { Search } from "./Search/Search";
import { TablaTipos } from "./TablaTipos/TablaTipos";
import { AllAtacks } from "./AllAtacks/AllAtacks";
import { useState, useEffect } from 'react';
import "./Header.css"
import { useNavigate } from "react-router-dom";

export function Header(){

    const [search, setSearch] = useState('');
    const Navigate = useNavigate();

    let sendSearch = (value) => {
        setSearch(value);
    }
  
    useEffect(() => {
        if(search != ''){ 
        Navigate(`/pokemon/${search}`)};
    }, [search, Navigate]);

    return(
        <header className="header">
            <Search sendSearch={sendSearch} />
            
            <div>
                <TablaTipos />
                <AllAtacks />
            </div>
            
        </header>
    )
};