import { useState, useEffect } from "react";
import { useNotifier } from "../hooks/useNotifier.mjs";
import { getAllSelectedPlaces, deletePlace, deletePlaces } from "../../services/places.mjs";
import { NotificationType, ChannelType, TargetType } from "../../constants/notificationOptions.mjs";
import { isEmpty } from "../helper/arrayValidations.mjs";
import { EMPTY_SELECTED_PLACES } from "../../constants/emptyPlacesMessages.mjs";

export function useSelectedPlaces() {
    const {
        notification: notificationInline,
        notify: notifyInline,
        reset: resetInline
    } = useNotifier();
    const {
        notification: notificationModal,
        notify: notifyModal,
        reset: resetModal
    } = useNotifier();
    const [selectedPlaces, setSelectedPlaces] = useState([]);
    const [loadingPlaces, setLoadingPlaces] = useState(false);

    const fetchAllSelectedPlaces = async () => {
        setLoadingPlaces(true);

        try {
            const data = await getAllSelectedPlaces();
            setSelectedPlaces(data);
        } catch(error) {
            notifyInline(error.message, NotificationType.ERROR, TargetType.SELECTED);
        } finally {
            setLoadingPlaces(false);
        }
    }

    useEffect(() => {
        const fetch = async () => await fetchAllSelectedPlaces();

        fetch();
    }, [])

    useEffect(() => {
        const isEmptyList = isEmpty(selectedPlaces);
        const isShowingEmptyMsg = notificationInline.text === EMPTY_SELECTED_PLACES;
              
        //Si la lista está vacía y aún no estoy mostrando el mensaje, lo disparo:
        if(isEmptyList && !isShowingEmptyMsg) {
            notifyInline(EMPTY_SELECTED_PLACES, NotificationType.INFO, TargetType.SELECTED);
            return;
        }
              
        //Si la lista NO está vacía y HAY texto en la notificación, la limpio:
        if(!isEmptyList && notificationInline.text) {
            resetInline();
        }
    }, [selectedPlaces, notifyInline, resetInline])

    const deleteSelectedPlace = async (id) => {
        const backupPlaces = [...selectedPlaces]

        setSelectedPlaces((prevSelectedPlaces) => {
            return prevSelectedPlaces.filter(place => place.id != id)
        })
      
        try {
            const { message } = await deletePlace(id)
            await fetchAllSelectedPlaces();
            return { succes: message, type: NotificationType.SUCCESS };
        } catch(error) {
            setSelectedPlaces(backupPlaces); 
            return { error: error.message, type: NotificationType.ERROR };  
        }
    }
    
    const deleteSelectedPlaces = async () => {
        const backupPlaces = [...selectedPlaces]

        setSelectedPlaces([])
        
        try {
            const { message } = await deletePlaces();

            await fetchAllSelectedPlaces();
            return { succes: message, type: NotificationType.SUCCESS };
        } catch(error) {
            setSelectedPlaces(backupPlaces);
            return { error: error.message, type: NotificationType.ERROR };
        }
    }

    return {
        notificationInline,
        notificationModal,
        notifyModal,
        resetModal,
        selectedPlaces,
        deleteSelectedPlaces,
        deleteSelectedPlace,
        loadingPlaces
    }
}