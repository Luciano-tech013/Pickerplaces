import { useSelectedPlaces } from "../libs/hooks/useSelectedPlaces.mjs";
import { useMessageInline } from "../libs/hooks/useMessageInline.mjs";
import { useMessageModal } from "../libs/hooks/useMessageModal.mjs";
import Modal from "../components/molecules/Modal/Modal"
import ListPlace from "../components/molecules/ListPlace/ListPlace";
import Message from "../components/atoms/Message/Message";

const getClassName = type => type.error ? "error" : "succes";

//Se encarga de mostrar el form y mostrar los lugares seleccionados persistidos
export default function PlacesPage() {
    const { isOpen, dialogRef, messageModal, showMessageModal, closeMessageModal } = useMessageModal();
    const { messageInline, showMessageInline } = useMessageInline();
    const { selectedPlaces } = useSelectedPlaces(showMessageInline)

    const handleWarnMessageModal = () => {
        showMessageModal("ADVERTENCIA!. Si acepta la operación, el lugar será eliminado definitvamente. ¿Desea eliminarlo?", "warn");
    }

    const handleDeleteSelectedPlace = () => {
        closeMessageModal();
    }

    const messageModalCuption = isOpen && <Message className={getClassName}>{messageModal.text}</Message>
    const messageSelectedPlacesCaption = messageInline;

    return (
        <section>
            <Modal open={isOpen} dialogRef={dialogRef}>
                {messageModalCuption}
                <button onClick={handleDeleteSelectedPlace}>Sí, deseo eliminarlo</button>    
            </Modal>

            <ListPlace
                places={selectedPlaces}
                message={messageSelectedPlacesCaption}
                onClick={handleWarnMessageModal}
            />
        </section>
    )
}