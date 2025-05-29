import { Routes, Route, Navigate } from 'react-router-dom';
import MenuNav from "../components/molecules/MenuNav/MenuNav.jsx";
import HomePage from '../pages/HomePage.jsx';
import PlacesPage from '../pages/PlacesPage.jsx';

import pickerplaces from "../../public/pickerplaces.png";

export default function Router() {
    return (
        <>
            <header>
                <h1><img src={pickerplaces} alt="Logo Pickerplaces"/>PICKERPLACES</h1>
                <MenuNav/>
            </header>
            <Routes> 
                <Route path="/" element={<HomePage/>}/>
                <Route path="/places" element={<PlacesPage/>}/>
            </Routes>
        </>
    )
}
