import { createPortal } from 'react-dom';

export default function Modal({ open, dialogRef, children }) {
  
  return createPortal(
    <dialog className="modal" ref={dialogRef}>
      {open && children}
    </dialog>,
    document.getElementById('modal')
  );
}