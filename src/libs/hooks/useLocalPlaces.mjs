import { useState } from "react";

const inizializeSelectedPlaces = () => {
    //Cargar del localStorage al iniciar el componente
    const stored = localStorage.getItem("localPlaces");
    return stored ? JSON.parse(stored) : [];
}

//Solo maneja los placces en el localStorage
export function useLocalPlaces(onShowMessage, onSavePlaces) {
    const [localPlaces, setLocalPlaces] = useState(() => inizializeSelectedPlaces());
    
    const saveLocalPlaces = async () => {
        try {
            const message  = await onSavePlaces(localPlaces);

            onShowMessage(message, "succes");
        } catch(error) {
            onShowMessage(error.message, "error");
        }
    }

    const deleteLocalPlace = (id) => {
        if(localPlaces.length === 0) return;

        setLocalPlaces(prevLocalPlaces => {
            const updatedLocalPlaces = prevLocalPlaces.filter(place => place.id !== id);
            localStorage.setItem("localPlaces", JSON.stringify(updatedLocalPlaces));
            return updatedLocalPlaces;
        });
    }

    const containsPlace = (place) => {
        return localPlaces.some(p => p.id === place.id);
    }

    const addLocalPlace = (place) => {
        if(containsPlace(place)) return;
        
        setLocalPlaces(prevLocalPlaces => {
            const updatedLocalPlaces = [...prevLocalPlaces, place];
            localStorage.setItem("selectedPlaces", JSON.stringify(updatedLocalPlaces));
            return updatedLocalPlaces;
        });
    }

    const clearLocalPlaces = () => {
        localStorage.clear();
        setLocalPlaces(() => inizializeSelectedPlaces());
    }

    return {
        localPlaces,
        saveLocalPlaces,
        clearLocalPlaces,
        deleteLocalPlace,
        addLocalPlace
    }
}