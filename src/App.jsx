import { useSelectedPlace } from './libs/hooks/useSelectedPlace.mjs';
import { useAvailablePlaces } from './libs/hooks/useAvailablePlaces.mjs';
import { useMessageModal } from './libs/hooks/useMessageModal.mjs';
import { useMessageInline } from './libs/hooks/useMessageInline.mjs';
import ListPlace from './components/molecules/ListPlace/ListPlace';
import Modal from './components/molecules/Modal/Modal';
import Message from './components/atoms/Message/Message.jsx';
import Form from './components/molecules/Form/Form';

import './App.css'

const isEmpty = array => array.length === 0;

const getClassName = type => type.error ? "error" : "succes";

export default function App() {
    const { isOpen, dialogRef, messageModal, showMessageModal, closeMessageModal } = useMessageModal();
    const { messageInline, showMessageInline } = useMessageInline();
    const { availablePlaces, findPlaceById, saveAvailablePlace } = useAvailablePlaces(showMessageInline, showMessageModal);
    const { selectedPlaces, saveSelectedPlaces, deleteSelectedPlace, handleAppendSelectPlace } = useSelectedPlace(showMessageModal);
    
    const handleSelectPlace = (id) => {
        const place = findPlaceById(id);
        if(!place) {
            return;
        }

        handleAppendSelectPlace(place);
    }

    const handleDeleteSelectedPlace = (id) => {
        deleteSelectedPlace(id);
    }

    const messageModalCuption = isOpen && <Message className={getClassName}>{messageModal.text}</Message>
    const messageInlineCaption = messageInline && <Message className="error">{messageInline}</Message>;

    const messageEmptyAvailablePlacesCaption = isEmpty(availablePlaces) && <Message className="info">Not available places...</Message>;
    const messageAvailablePlacesCaption = messageInlineCaption || messageEmptyAvailablePlacesCaption || null;

    const messageEmptySelectedPlacesCaption = isEmpty(selectedPlaces) && <Message className="info">Not selected places...</Message>;
    const messageSelectedPlacesCaption = messageEmptySelectedPlacesCaption || null;
    
    return (
        <> 
            <Modal open={isOpen} dialogRef={dialogRef}>
                {messageModalCuption}
                <button onClick={closeMessageModal}>CONFIRMAR</button>    
            </Modal>

            <h2>Lugares elegidos</h2>
            <ListPlace 
                places={selectedPlaces}
                message={messageSelectedPlacesCaption}
                onClick={handleDeleteSelectedPlace}
            />
            {!isEmpty(selectedPlaces) && <button onClick={saveSelectedPlaces}>GUARDAR SELECCIONES</button>}

            <h2>Lugares disponibles</h2>
            <ListPlace 
                places={availablePlaces}
                message={messageAvailablePlacesCaption}
                onClick={handleSelectPlace}
            />
            
            <Form onSaveAvailablePlace={saveAvailablePlace}/>

        </>
    )
}
