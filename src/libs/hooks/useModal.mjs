import { useState, useRef, useEffect, useLayoutEffect } from 'react';

export function useModal() {
    const [isOpen, setIsOpen] = useState(false);

    const dialogRef = useRef();

    useEffect(() => {
        if(!dialogRef.current) return;
        
        if(isOpen) {
          dialogRef.current.showModal();
        } else {
          dialogRef.current.close();
        }
    }, [isOpen]);

    const handleToggleModal = () => {
        setIsOpen(!isOpen);
    }

    return {
        isOpen,
        dialogRef,
        handleToggleModal
    }
}