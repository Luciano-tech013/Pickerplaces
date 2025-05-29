import { useInvalidField } from "../libs/hooks/useInvalidField.mjs";
import { useMessageModal } from "../libs/hooks/useMessageModal.mjs";
import Form from "../components/molecules/Form/Form.jsx";
import Modal from "../components/molecules/Modal/Modal.jsx"
import Message from "../components/atoms/Message/Message.jsx";

export default function FormPage({ onSaveAvailablePlace }) {
    const { invalidation, handleHasInvalidation, hasAnyInvalidation, clearAllValidations } = useInvalidField();
    const { isOpen, dialogRef, messageModal, showMessageModal, closeMessageModal } = useMessageModal();
        
    const handleSubmitPlace = (event) => {
        event.preventDefault();
    
        const formData = new FormData(event.target);
    
        const name = formData.get('name');
        const imageFile = formData.get('image');
    
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
        //setName('');
        event.target.reset();
    }
    
    //Espero un mensaje de tipo error
    const messageModalCuption = isOpen && <Message className="error">{messageModal.text}</Message>

    return (
        <section>
            <Modal open={isOpen} dialogRef={dialogRef}>
                {messageModalCuption}
                <button onClick={closeMessageModal}>CONFIRMAR</button>    
            </Modal>

            <Form invalidation={invalidation} onValidation={handleHasInvalidation} onSubmit={handleSubmitPlace} />
        </section>
    )
}