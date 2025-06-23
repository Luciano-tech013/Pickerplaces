import { useSelectedPlaces } from "../libs/hooks/useSelectedPlaces.mjs";
import { useState } from "react";
import { ChannelType, NotificationType, TargetType } from "../constants/notificationOptions.mjs";
import { ACCEPT_DELETE_PLACE, WARN_DELETE_PLACE, ERROR_DELETE_PLACE} from "../constants/deletePlaceMessages.mjs";
import ListPlace from "../components/molecules/ListPlace/ListPlace";
import Notifier from "../components/molecules/Notifier/Notifier.jsx";
import Spinner from "../components/molecules/Spinner/Spinner.jsx";

//Se encarga de mostrar el form y mostrar los lugares seleccionados persistidos
export default function PlacesPage() {
    const { 
        notificationInline,
        notificationModal,
        notifyModal,
        resetModal,
        selectedPlaces,
        deleteSelectedPlaces,
        deleteSelectedPlace,
        loadingPlaces: loadingSelectedPlaces
    } = useSelectedPlaces()
    const [ idDeletable, setIdDeletable ] = useState(null);
    const [ loadingDelete, setLoadingDelete ] = useState(false);

    const handleWarnMessageModal = (idParam) => {
        if(idParam || idDeletable) {
            setIdDeletable(idParam);
        }
        
        notifyModal(WARN_DELETE_PLACE, NotificationType.WARNING);
    }

    //React agrupa mas de 1 render para hacer 1 render final
    const handleDeleteSelectedPlace = () => {
        if(!idDeletable) {
            notifyModal(ERROR_DELETE_PLACE, NotificationType.ERROR)
        }

        if(idDeletable) {
            setLoadingDelete(true)
            deleteSelectedPlace(idDeletable)
                .then(res => {
                    if(res.succes) {
                        notifyModal(res.succes, res.type)
                    }

                    if(res.error) {
                        notifyModal(res.error, res.type)
                    }
                })
                .finally(() => {
                    setLoadingDelete(false)
                    setIdDeletable(null)
                })
        } 
    }

    const handleDeleteSelectedPlaces = async () => {
        setLoadingDelete(true)
        deleteSelectedPlaces()
            .then(res => {
                if(res.succes) {
                    notifyModal(res.succes, res.type)
                }

                if(res.error) {
                    notifyModal(res.error, res.type)
                }
            })
            .finally(() => {
                setLoadingDelete(false);
            })
    }
    
    //El eliminar place no se lo tengo que pasar siempre al Notifier, depende del tipo de notificacion
    const deleteByIdCuption = notificationModal.type === NotificationType.WARNING && idDeletable && handleDeleteSelectedPlace;
    const deleteAllCuption = notificationModal.type === NotificationType.WARNING && !idDeletable && handleDeleteSelectedPlaces;
    
    const actionCuption = deleteByIdCuption || deleteAllCuption || resetModal; 
    const btnContentCuption = notificationModal.type === NotificationType.WARNING && ACCEPT_DELETE_PLACE;

    const messageSelectedPlacesCuption = notificationInline.target === TargetType.SELECTED ? notificationInline : null;
    
    return (
        <section>
            <button onClick={() => handleWarnMessageModal(null)}>VACIAR</button>

            {(loadingDelete || notificationModal) && (
                <Notifier 
                    notification={notificationModal}
                    channel={ChannelType.MODAL}
                    action={actionCuption} 
                    reset={resetModal} 
                    btnContent={btnContentCuption}
                    withLoading={loadingDelete}
                />
            )}

            {loadingSelectedPlaces && <Spinner/>}
            {!loadingSelectedPlaces && messageSelectedPlacesCuption ? (
                <Notifier 
                    notification={notificationInline} 
                    channel={ChannelType.INLINE} 
                />
            ) : (
                <ListPlace onClick={handleWarnMessageModal}>
                    {selectedPlaces}
                </ListPlace>
            )}
        </section>
    )
}