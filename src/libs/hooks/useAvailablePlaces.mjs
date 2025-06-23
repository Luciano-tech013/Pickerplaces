import { useState, useEffect } from 'react';
import { useNotifier } from '../hooks/useNotifier.mjs';
import { createPlace, getAllPlaces } from '../../services/places.mjs';
import { isEmpty } from '../helper/arrayValidations.mjs';
import { EMPTY_AVAILABLE_PLACES } from '../../constants/emptyPlacesMessages.mjs';
import { NotificationType, TargetType } from '../../constants/notificationOptions.mjs';

export function useAvailablePlaces() {
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
    const [availablePlaces, setAvailablePlaces] = useState([]);
    const [loadingPlaces, setLoadingPlaces] = useState(false);
    
    const fetchAvailablePlaces = async () => {
        setLoadingPlaces(true);

        try {
            const data = await getAllPlaces();
            setAvailablePlaces(data);
        } catch (error) {
            notifyInline(error.message, NotificationType.ERROR, TargetType.AVAILABLE)
        } finally {
            setLoadingPlaces(false)
        }
    }

    useEffect(() => {
        const fetch = async () => await fetchAvailablePlaces();

        fetch();
    }, [])

    useEffect(() => {
        const isEmptyList = isEmpty(availablePlaces);
        const isShowingEmptyMsg = notificationInline.text === EMPTY_AVAILABLE_PLACES;
              
        // Si la lista está vacía y aún no estoy mostrando el mensaje, lo disparo:
        if(isEmptyList && !isShowingEmptyMsg) {
            notifyInline(EMPTY_AVAILABLE_PLACES, NotificationType.INFO, TargetType.AVAILABLE);
            return;
        }
              
        //Si la lista NO está vacía y HAY texto en la notificación, la limpio:
        if(!isEmptyList && notificationInline.text) {
            resetInline();
        }
    }, [availablePlaces, notifyInline, resetInline])

    const saveAvailablePlace = async (place) => {
        try {
            const { message } = await createPlace(place);

            await fetchAvailablePlaces();
            return { succes: message, type: NotificationType.SUCCESS }
        } catch(error) {
            return { error: error.message, type: NotificationType.ERROR }
        } 
    }

    const findPlaceById = (id) => {
        return availablePlaces.find(place => place.id === id);
    }

    return {
        notificationInline,
        notificationModal,
        resetModal,
        availablePlaces,
        findPlaceById,
        saveAvailablePlace,
        loadingPlaces
    }
}