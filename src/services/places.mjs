const API_URL = "http://localhost:3000/api";

export const getAllPlaces = async () => {
    let response;

    try {
        response = await fetch(`${API_URL}/places`, {
            headers: { "Accept": "application/json" }
        });
    } catch (error) {
        throw new Error("¡Ups! The system is down.");
    }
    
    if(!response.ok) {
        throw new Error("¡Ups! An error occurred while fetching the data.");
    }

    return await response.json();
}

export const savePlaces = async (selectedPlaces) => {
    let response;

    try {
        response = await fetch(`${API_URL}/places/save`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json"
            },
            body: JSON.stringify(selectedPlaces)
        });
    } catch(error) {
        throw new Error("¡Ups! The system is down.");
    }

    if(response.status != 201) {
        throw new Error("¡Ups! An error occurred while saving the selected places.");
    }
    
    return await response.json();
} 

export const createPlace = async (place) => {
    let response;

    try {
        response = await fetch(`${API_URL}/places/create`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json"
            },
            body: JSON.stringify(place)
        });      
    } catch(error) {
        throw new Error("¡Ups! The system is down.");
    }

    if(response.status != 201) {
        throw new Error("¡Ups! An error occurred while creating the place.");
    }

    return await response.json();
}