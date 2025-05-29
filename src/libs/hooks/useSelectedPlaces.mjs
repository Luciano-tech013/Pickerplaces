import { useState, useEffect } from "react";
import { getAllSelectedPlaces } from "../../services/places.mjs";

export function useSelectedPlaces(onShowMessageInline) {
    const [selectedPlaces, setSelectedPlaces] = useState([]);

    useEffect(() => {
        const fetchAllSelectedPlaces = async () => {
            try {
                const data = await getAllSelectedPlaces();
                setSelectedPlaces(data);
            } catch(error) {
                onShowMessageInline(error.message);
            }
        }

        fetchAllSelectedPlaces();
    }, [selectedPlaces])

    /**
     * Delego la responsabilidad de mostrar los mensajes de error o de exito
     * al saveLocalPlaces del localStorage, quien es el único que utiliza ésta funcion
     */
    const saveSelectedPlaces = async (localPlaces) => {
        try {
            const { message } = await saveSelectedPlaces(localPlaces);
            return message;
        } catch(error) {
            throw new Error(error.message);
        }
    }

    return {
        selectedPlaces,
        saveSelectedPlaces
    }
}