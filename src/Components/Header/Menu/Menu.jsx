import { TiThMenu } from "react-icons/ti";
import "./Menu.css"
import { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";

export function Menu() {

    const [open, setOpen] = useState(false);
    const menuRef = useRef(null);

    useEffect(() => {
        function handleClickOutside(event) {
            if (menuRef.current && !menuRef.current.contains(event.target)) {
                setOpen(false);
            }
        }

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);


    return (
        <nav ref={menuRef}>
            <button onClick={() => setOpen(!open)}>
                <TiThMenu className="menu-icon" />
            </button>
            <div className= {`menu ${open ? "open" : ""}`}>
                <Link to="/types"><p>Tipos</p></ Link>
                <Link to="/ataques"><p>Ataques</p></ Link>
                <Link to="/items"><p>Items</p></ Link>
            </div>
        </nav>
    )
}