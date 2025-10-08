import { Search } from "./Search/Search";
import { Menu } from "./Menu/Menu";
import { useState, useEffect } from 'react';
import "./Header.css"
import { useNavigate, Link } from "react-router-dom";

export function Header(){

    const [search, setSearch] = useState('');
    const Navigate = useNavigate();

    let sendSearch = (value) => {
        setSearch(value);
    }
  
    useEffect(() => {
        if(search != ''){ 
        Navigate(`/pokemon/${search}`)};
    }, [search]);

    return(
        <header className="header">
            <Search sendSearch={sendSearch} />
            
            <div className="section-header">
                <Menu />
                <Link to="/types"><h2 className="h2-header">Tipos</h2></ Link>
                <Link to="/ataques"><h2 className="h2-header">Ataques</h2></ Link>
                <Link to="/items"><h2 className="h2-header">Items</h2></ Link>
            </div>
            
        </header>
    )
};