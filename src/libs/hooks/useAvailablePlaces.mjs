import { useState, useEffect } from 'react';
import { createPlace, getAllPlaces } from '../../services/places.mjs';

export function useAvailablePlaces(onShowMessageInline, onShowMessageModal) {
    const [availablePlaces, setAvailablePlaces] = useState([]);
    
    useEffect(() => {
        console.log("Hola me ejecute");
        const fetchAvailablePlaces = async () => {
            try {
                const data = await getAllPlaces();
                setAvailablePlaces(data);
            } catch (error) {
                onShowMessageInline(error.message);
            }
        }

        fetchAvailablePlaces();
    }, []);

    const findPlaceById = (id) => {
        return availablePlaces.find(place => place.id === id);
    }

    const saveAvailablePlace = async (place) => {
        try {
            const { message } = await createPlace(place);
            onShowMessage(message, "success");
        } catch(error) {
            onShowMessage(error.message, "error");
        }
    }

    return {
        availablePlaces,
        findPlaceById,
        saveAvailablePlace
    }
}