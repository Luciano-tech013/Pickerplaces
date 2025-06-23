import { useLocalPlaces } from '../libs/hooks/useLocalPlaces.mjs';
import { useAvailablePlaces } from '../libs/hooks/useAvailablePlaces.mjs';
import { isEmpty } from '../libs/helper/arrayValidations.mjs';
import { ChannelType, NotificationType, TargetType } from '../constants/notificationOptions.mjs';
import { INVALID_SHOW_FORM_PAGE } from '../constants/formMessages.mjs';
import ListPlace from '../components/molecules/ListPlace/ListPlace.jsx';
import FormPage from '../pages/FormPage.jsx';
import Notifier from '../components/molecules/Notifier/Notifier.jsx';
import Spinner from "../components/molecules/Spinner/Spinner.jsx";

import "./HomePage.css"

export default function HomePage() {
    const {
        notificationInline: notificationAvailableInline,
        notificationModal: notificationAvailableModal,
        resetModal: resetAvailableModal,
        availablePlaces, 
        findPlaceById, 
        saveAvailablePlace,
        loadingPlaces: loadingAvailablePlaces
    } = useAvailablePlaces();
    const { 
        notificationInline: notificationLocalInline,
        notificationModal: notificationLocalModal,
        resetModal: resetLocalModal,
        localPlaces,
        saveLocalPlaces, 
        deleteLocalPlace, 
        addLocalPlace,
        loadingPlaces: loadingLocalPlaces
    } = useLocalPlaces();

    const handleSelectPlace = (id) => {
        const place = findPlaceById(id);
        if(!place) {
            return;
        }

        addLocalPlace(place);
    }

    const handleSaveSelectedPlaces = async () => {
        await saveLocalPlaces(localPlaces);
    }

    //Si hay una notificacion (texto) me quedo con el objeto ese
    const notificationLocalModalCuption = notificationLocalModal.text && notificationLocalModal;
    const notificationAvailableModalCuption = notificationAvailableModal.text && notificationAvailableModal;
    const notificationModalCuption = notificationLocalModalCuption || notificationAvailableModalCuption || null;

    const resetLocalModalCuption = notificationLocalModalCuption ? resetLocalModal : null;
    const resetAvailableModalCuption = notificationAvailableModalCuption ? resetAvailableModal : null;
    const resetModalCuption = resetLocalModalCuption || resetAvailableModalCuption || null;

    const messageLocalPlacesCuption = notificationLocalInline && notificationLocalInline.target === TargetType.LOCAL ? notificationLocalInline : null;
    const messageAvailablePlacesCuption = notificationAvailableInline && notificationAvailableInline.target === TargetType.AVAILABLE ? notificationAvailableInline : null;

    //El unico que puede tener un ERROR de conexion es availablePlaces por sus llamadas a la API
    const formPageShowCuption = notificationAvailableInline.type === NotificationType.ERROR ? false : true
    
    return (
        <section>
            {notificationModalCuption && (
                <Notifier notification={notificationModalCuption} channel={ChannelType.MODAL} reset={resetModalCuption}/>
            )}
            
            <h2>Lugares elegidos localmente</h2>
            {loadingLocalPlaces && <Spinner/>}
            {!loadingLocalPlaces && messageLocalPlacesCuption ? (
                <Notifier notification={notificationLocalInline} channel={ChannelType.INLINE}/>
            ) : (
                <ListPlace onClick={deleteLocalPlace}>
                    {localPlaces}
                </ListPlace>
            )}
            {!isEmpty(localPlaces) && <button onClick={handleSaveSelectedPlaces}>GUARDAR SELECCIONES</button>}
        
            <h2>Lugares disponibles</h2>
            {loadingAvailablePlaces && <Spinner/>}
            {!loadingAvailablePlaces && messageAvailablePlacesCuption ? (
                <Notifier notification={notificationAvailableInline} channel={ChannelType.INLINE}/>
            ) : (
                <ListPlace onClick={handleSelectPlace}>
                    {availablePlaces}
                </ListPlace>
            )}

            <h2>Crear un nuevo lugar disponible</h2>
            {!formPageShowCuption ? (
                <Notifier notification={{ text: INVALID_SHOW_FORM_PAGE, type: NotificationType.INFO }} channel={ChannelType.INLINE}/>
            ) : (
                <FormPage onSaveAvailablePlace={saveAvailablePlace}/>
            )}
        </section>
    )
}