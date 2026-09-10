import { useState, type ReactNode } from 'react';
import { createPortal } from 'react-dom';
import type { MouseEventHandler } from 'react';
type ModalProps = {
    children: ReactNode
}

type ModalContentProps = {
    onClose: MouseEventHandler<HTMLButtonElement>
}
export default function Modal({children}: ModalProps) {
  const [showModal, setShowModal] = useState(false);
  return (
    <>
      <button className="hover:cursor-pointer w-full" onClick={() => setShowModal(true)}>
        {children}
      </button>
      {showModal && createPortal(
        <ModalContent onClose={() => setShowModal(false)}/>,
        document.body
      )}
    </>
  );
}

export function ModalContent({ onClose }: ModalContentProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-white">I'm a modal dialog
        <button onClick={onClose}>Close</button>
      </div>
    </div>
  );
}