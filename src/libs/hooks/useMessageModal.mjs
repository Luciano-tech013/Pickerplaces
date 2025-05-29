import { useState } from 'react';
import { useModal } from './useModal.mjs';

export function useMessageModal() {
  const { isOpen, dialogRef, handleToggleModal } = useModal();
  const [messageModal, setMessageModal] = useState({ text: '', type: '' });

  const showMessageModal = (text, type) => {
    handleSaveMessageModal(text, type);
    handleToggleModal(); //Abrir el modal
  };

  const closeMessageModal = () => {
    setMessageModal({ text: '', type: ''})
    handleToggleModal(); //Cerrar el modal
  };

  const handleSaveMessageModal = (text, type) => {
    setMessageModal(prevMessage => {
        let messageCopy = {...prevMessage};
        messageCopy.text = text;
        messageCopy.type = type;

        return messageCopy;
    });
  }

  return { isOpen, dialogRef, messageModal, showMessageModal, closeMessageModal };
}