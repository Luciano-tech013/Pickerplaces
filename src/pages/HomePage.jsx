import { useState } from 'react';
import { useLocalPlaces } from '../libs/hooks/useLocalPlaces.mjs';
import { useAvailablePlaces } from '../libs/hooks/useAvailablePlaces.mjs';
import { useMessageModal } from '../libs/hooks/useMessageModal.mjs';
import { useMessageInline } from '../libs/hooks/useMessageInline.mjs';
import ListPlace from '../components/molecules/ListPlace/ListPlace.jsx';
import FormPage from '../pages/FormPage.jsx';
import Modal from '../components/molecules/Modal/Modal.jsx';
import Message from '../components/atoms/Message/Message.jsx';

import "./HomePage.css"

const isEmpty = array => array.length === 0;

const getClassName = type => type.error ? "error" : "succes";

export default function HomePage() {
    const [showForm, setShowForm] = useState(false);
    const { isOpen, dialogRef, messageModal, showMessageModal, closeMessageModal } = useMessageModal();
    const { messageInline, showMessageInline } = useMessageInline();
    const { availablePlaces, findPlaceById, saveAvailablePlace } = useAvailablePlaces(showMessageInline, showMessageModal);

    const { localPlaces, saveLocalPlaces, clearLocalPlaces, deleteLocalPlace, addLocalPlace } = useLocalPlaces(showMessageModal, );

    const handleSelectPlace = (id) => {
        const place = findPlaceById(id);
        if(!place) {
            return;
        }

        addLocalPlace(place);
    }

    const handleSaveSelectedPlaces = () => {
        saveLocalPlaces(localPlaces);
        clearLocalPlaces();
    }

    const handleDeleteSelectedPlace = (id) => {
        deleteLocalPlace(id);
    }

    const handleToggleForm = () => {
        setShowForm(!showForm);
    }

    const messageModalCuption = isOpen && <Message className={getClassName}>{messageModal.text}</Message>
    const messageInlineCaption = messageInline && <Message className="error">{messageInline}</Message>;

    const messageEmptyAvailablePlacesCaption = isEmpty(availablePlaces) && <Message className="info">Not available places...</Message>;
    const messageAvailablePlacesCaption = messageInlineCaption || messageEmptyAvailablePlacesCaption || null;

    const messageEmptySelectedPlacesCaption = isEmpty(localPlaces) && <Message className="info">Not selected places...</Message>;
    const messageSelectedPlacesCaption = messageEmptySelectedPlacesCaption || null;

    return (
        <section>
            <Modal open={isOpen} dialogRef={dialogRef}>
                {messageModalCuption}
                <button onClick={closeMessageModal}>CONFIRMAR</button>    
            </Modal>
            
            <h2>Lugares elegidos</h2>
            <ListPlace 
                places={localPlaces}
                message={messageSelectedPlacesCaption}
                onClick={handleDeleteSelectedPlace}
            />
            {!isEmpty(localPlaces) && <button onClick={handleSaveSelectedPlaces}>GUARDAR SELECCIONES</button>}
            
            <h2>Lugares disponibles</h2>
            <ListPlace 
                places={availablePlaces}
                message={messageAvailablePlacesCaption}
                onClick={handleSelectPlace}
            />

            <h2>Crear un nuevo lugar disponible</h2>
            <button onClick={handleToggleForm}>Abrir formulario</button>

            {showForm && <FormPage onSaveAvailablePlace={saveAvailablePlace}/>}
        </section>
    )
}