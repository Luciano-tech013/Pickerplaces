import { useState, useEffect } from "react";
import { useNotifier } from "../hooks/useNotifier.mjs";
import { savePlaces } from "../../services/places.mjs";
import { KEY_LOCAL_STORAGE } from "../../config.mjs";
import { EMPTY_LOCAL_PLACES } from "../../constants/emptyPlacesMessages.mjs";
import { isEmpty } from "../helper/arrayValidations.mjs";
import { NotificationType, TargetType } from "../../constants/notificationOptions.mjs";

const inizializeLocalPlaces = () => {
    //Cargar del localStorage al iniciar el componente
    const stored = localStorage.getItem(KEY_LOCAL_STORAGE);
    return stored ? JSON.parse(stored) : [];
}

const updatedLocalPlaces = (newLocalPlaces) => {
    localStorage.setItem(KEY_LOCAL_STORAGE, JSON.stringify(newLocalPlaces))
    return newLocalPlaces
}

//Solo maneja los placces en el localStorage
export function useLocalPlaces() {
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
    const [localPlaces, setLocalPlaces] = useState(() => inizializeLocalPlaces());
    const [loadingPlaces, setLoadingPlaces] = useState(false);

    const fetchLocalPlaces = () => {
        const data = inizializeLocalPlaces();
        setLocalPlaces(data);
    }

    useEffect(() => {
        fetchLocalPlaces();
    }, [])

    useEffect(() => {
        const isEmptyList = isEmpty(localPlaces);
        const isShowingEmptyMsg = notificationInline.text === EMPTY_LOCAL_PLACES;
      
        // Si la lista está vacía y aún no estoy mostrando el mensaje, lo disparo:
        if (isEmptyList && !isShowingEmptyMsg) {
          notifyInline(EMPTY_LOCAL_PLACES, NotificationType.INFO, TargetType.LOCAL);
          return;
        }
      
        // Si la lista NO está vacía y HAY texto en la notificación, la limpio:
        if (!isEmptyList && notificationInline.text) {
          resetInline();
        }
    }, [localPlaces, notificationInline.text, notifyInline, resetInline]);
      

    const saveLocalPlaces = async () => {
        const backupPlaces = [...localPlaces];
        
        //Borrado previo para activar spinner
        setLocalPlaces([])
        setLoadingPlaces(true);

        try {
            const { message } = await savePlaces(localPlaces);

            clearLocalPlaces();
            notifyModal(message, NotificationType.SUCCESS)
        } catch(error) {
            notifyModal(error.message, NotificationType.ERROR)
            setLocalPlaces(backupPlaces);
        } finally {
            setLoadingPlaces(false);
        }
    }

    const deleteLocalPlace = (id) => {
        if(localPlaces.length === 0) return;

        setLocalPlaces(prevLocalPlaces => {
            const newLocalPlaces = prevLocalPlaces.filter(place => place.id !== id);
            return updatedLocalPlaces(newLocalPlaces);
        });
    }

    const containsPlace = (place) => {
        return localPlaces.some(p => p.id === place.id);
    }

    const addLocalPlace = (place) => {
        if(containsPlace(place)) return;
        
        setLocalPlaces(prevLocalPlaces => {
            const newLocalPlaces = [...prevLocalPlaces, place];
            return updatedLocalPlaces(newLocalPlaces)
        });
    }

    const clearLocalPlaces = () => {
        localStorage.clear();
        setLocalPlaces(() => inizializeLocalPlaces());
    }

    return {
        notificationInline,
        notificationModal,
        resetModal,
        localPlaces,
        saveLocalPlaces,
        deleteLocalPlace,
        addLocalPlace,
        loadingPlaces
    }
}