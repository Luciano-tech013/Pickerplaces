const API_URL = "http://localhost:3000/api";

const handleFetch = async (endpoint, options, status = 200, errorMessage) => {
    let response;

    try {
        response = await fetch(`${API_URL}${endpoint}`, {
            ...options
        })
    } catch(error) {
        throw new Error("¡Ups!. The system is down")
    }

    if(response.status !== status) {
        throw new Error(errorMessage)
    }
    
    return response.json();
};

export const getAllPlaces = async () => {
    const options = {
        headers: {
            "Accept": "application/json"
        }
    }

    return await handleFetch("/places", options, 200, "¡Ups!. An error ocurred while fetching the data")
};

export const getAllSelectedPlaces = async () => {
    const options = {
        headers: {
            "Accept": "application/json"
        }
    }

    return await handleFetch("/places/selected", options, 200, "¡Ups!. An error ocurred while fetching the selected places")
};

export const savePlaces = async (selectedPlaces) => {
    const options = {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Accept": "application/json"
        },
        body: JSON.stringify(selectedPlaces)
    }

    return await handleFetch("/places/save", options, 201, "¡Ups!. An error ocurred while the saving places")
};

export const createPlace = async (place) => {
    const options = {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Accept": "application/json"
        },
        body: JSON.stringify(place)
    }

    return await handleFetch("/places/create", options, 201, "¡Ups!. An error ocurred while the creating place")
};
