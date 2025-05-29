import { useState } from "react";
import { savePlaces } from "../../services/places.mjs";

const inizializeSelectedPlaces = () => {
    //Cargar del localStorage al iniciar el componente
    const stored = localStorage.getItem("selectedPlaces");
    return stored ? JSON.parse(stored) : [];
}

export function useSelectedPlace(onShowMessage) {
    const [selectedPlaces, setSelectedPlaces] = useState(() => inizializeSelectedPlaces());
    
    const saveSelectedPlaces = async () => {
        try {
            const { message } = await savePlaces(selectedPlaces);

            onShowMessage(message, "succes");
            handleClearStorage(); // Limpiar el localStorage después de guardar
        } catch(error) {
            onShowMessage(error.message, "error");
        }
    }

    const deleteSelectedPlace = (id) => {
        if(selectedPlaces.length === 0) return;

        setSelectedPlaces(prevSelectedPlaces => {
            const updatedSelectedPlaces = prevSelectedPlaces.filter(place => place.id !== id);
            localStorage.setItem("selectedPlaces", JSON.stringify(updatedSelectedPlaces));
            return updatedSelectedPlaces;
        });
    }

    const fetchSelectedPlaces = async () => {
        try {

        } catch(error) {
            
        }
    }

    const containsPlace = (place) => {
        return selectedPlaces.some(p => p.id === place.id);
    }

    const handleAppendSelectPlace = (place) => {
        if(containsPlace(place)) return;
        
        setSelectedPlaces(prevSelectedPlaces => {
            const updatedSelectedPlaces = [...prevSelectedPlaces, place];
            localStorage.setItem("selectedPlaces", JSON.stringify(updatedSelectedPlaces));
            return updatedSelectedPlaces;
        });
    }

    const handleClearStorage = () => {
        localStorage.clear();
        setSelectedPlaces(() => inizializeSelectedPlaces());
    }

    return {
        selectedPlaces,
        saveSelectedPlaces,
        deleteSelectedPlace,
        handleAppendSelectPlace
    }
}