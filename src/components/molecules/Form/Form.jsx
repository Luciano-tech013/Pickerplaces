import { useState } from "react";
import { useInvalidField } from "../../../libs/hooks/useInvalidField.mjs";
import { useMessageModal } from "../../../libs/hooks/useMessageModal.mjs";
import Modal from "../Modal/Modal.jsx";
import Message from "../../atoms/Message/Message.jsx";

export default function Form({ onSaveAvailablePlace }) {
    const [name, setName] = useState('');
    const { invalidation, handleHasInvalidation, hasAnyInvalidation, clearAllValidations } = useInvalidField();
    const { isOpen, dialogRef, messageModal, showMessageModal, closeMessageModal } = useMessageModal();
    
    const handleChangeName = (event) => {
        let value = event.target.value;

        handleHasInvalidation("name", value);

        setName(value);
    }

    const handleChangeImage = (event) => {
        let value = event.target.value;

        handleHasInvalidation("image", value);
    }

    const handleSubmitPlace = (event) => {
        event.preventDefault();

        const formData = new FormData(event.target);

        const name = formData.get('name');
        const imageFile = formData.get('image');

        // Re-validar ambos campos
        /*handleHasInvalidation("name", name);
        handleHasInvalidation("image", imageFile);*/

        if(hasAnyInvalidation()) {
            showMessageModal("Por favor, corrije los errores para poder enviar el formulario", "error");
            return;
        }

        const place = {
            name,
            image: {
                src: URL.createObjectURL(imageFile),
                alt: name
            }
        };

        onSaveAvailablePlace(place);

        //Vaciar los campos del formulario y las validaciones realizadas
        clearAllValidations();
        setName('');
        event.target.reset();
    }

    //Espero un mensaje de tipo error
    const messageModalCuption = isOpen && <Message className="error">{messageModal.text}</Message>
    
    return (
        <>
            <Modal open={isOpen} dialogRef={dialogRef}>
                {messageModalCuption}
                <button onClick={closeMessageModal}>CONFIRMAR</button>    
            </Modal>
        
            <form onSubmit={handleSubmitPlace}>
                <label htmlFor="name">Nombre del lugar</label>
                <input type="text" id="name" name="name" value={name} onChange={handleChangeName} placeholder="Nombre del lugar" autoComplete="name" required />
                {invalidation.name?.isInvalid && <p>{invalidation.name.error}</p>}

                <label htmlFor="image">Imagen del lugar</label>
                <input type="file" id="image" name="image" onChange={handleChangeImage} placeholder="Cargar imagen" autoCorrect="off" required />
                {invalidation.image?.isInvalid && <p>{invalidation.image.error}</p>}

                <button type="sumbit">Crear Lugar</button>
            </form>
        </>
    );
}