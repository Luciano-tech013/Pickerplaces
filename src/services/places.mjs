const API_URL = "http://localhost:3000/api";

const hasError = (statusResponse, data, statusExpected, defaultMessage = "¡Ups!. An error ocurred") => {
    if(statusResponse !== statusExpected) {
        const apiMessage = data ? data.message : defaultMessage;
        throw new Error(apiMessage);   
    }
}

const request = async (options, endpoint, status = 200) => {
    let response;

    try {
        response = await fetch(`${API_URL}${endpoint}`, options);
        
        if(response.status === 404){
            throw new Error("¡Ups!. The System is down")
        }
    }catch(networkError) {
        throw new Error(networkError);
    }

    const data = await response.json();

    try {
        hasError(response.status, data, status);
    }catch(error) {
        throw error;
    }

    return data;
}

export const getAllPlaces = async () => {
    return request({
        method: "GET",
        headers: {
            "Accept": "application/json"
        }
    }, "/places")
}

export const getAllSelectedPlaces = async () => {
    return request({
        method: "GET",
        headers: {
            "Accept": "application/json"
        }
    }, "/places/selected")
};

export const savePlaces = async (selectedPlaces) => {
    return request({
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Accept": "application/json"
        },
        body: JSON.stringify(selectedPlaces)
    }, "/places/selected/save", 201)
};

export const createPlace = async (place) => {
    return request({
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Accept": "application/json"
        },
        body: JSON.stringify(place)
    }, "/places/create", 201);
};

export const deletePlace = async (id) => {
    return request({
        method: "DELETE",
        headers: {
            "Accept": "application/json"
        },
    }, `/places/selected/delete/${id}`)
};

export const deletePlaces = async () => {
    return request({
        method: "DELETE",
        headers: {
            "Accept": "application/json"
        },
    }, "/places/selected/clear")
}