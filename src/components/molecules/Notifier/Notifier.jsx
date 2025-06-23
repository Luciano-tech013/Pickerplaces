import { useEffect } from "react";
import { useModal } from "../../../libs/hooks/useModal.mjs";
import Message from "../../atoms/Message/Message";
import Modal from "../Modal/Modal";
import Spinner from "../Spinner/Spinner";
import { ChannelType, NotificationType } from "../../../constants/notificationOptions.mjs";

export default function Notifier({ notification, channel, action, reset, btnContent, withLoading }) {
    const { isOpen, dialogRef, handleToggleModal } = useModal();

    const btnContentCuption = !btnContent ? "Aceptar" : btnContent;

    useEffect(() => {
        if(!isOpen && (notification.text || withLoading)) {
            handleToggleModal();
        }
    }, [isOpen, notification.text, withLoading, handleToggleModal])

    const handleClickAcceptButton = () => {
        //Si hay accion seteada
        if(action) {
            action()
        }
        
        //Si no, me voy a la accion por defecto
        handleToggleModal();
        reset();
    }
    
    const handleClickCancelButton = () => {
        handleToggleModal();
        reset();
    }

    //Si la notificacion es modal
    if(channel === ChannelType.MODAL) {
        return (
            <Modal open={isOpen} dialogRef={dialogRef}>
                {withLoading && <Spinner/>}
                {!withLoading && <Message className={notification.type}>{notification.text}</Message>}
    
                {!withLoading && <button onClick={handleClickAcceptButton}>{btnContentCuption}</button>}
                {notification.type === NotificationType.WARNING && <button onClick={handleClickCancelButton}>CANCELAR</button>}    
            </Modal>
        )
    }

    //Si la notificaacion es inline
    if(channel === ChannelType.INLINE) {
        return (
            <Message className={notification.type}>{notification.text}</Message>
        )
    }
    
}