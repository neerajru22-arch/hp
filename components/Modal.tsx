
import React, { useEffect } from 'react';
import { XMarkIcon } from './icons/Icons';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, children }) => {
  useEffect(() => {
    const handleEsc = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleEsc);
    return () => {
      window.removeEventListener('keydown', handleEsc);
    };
  }, [onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50 transition-opacity duration-300 ease-in-out"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-lg shadow-xl w-full max-w-2xl m-4 transform transition-all duration-300 ease-in-out scale-95 opacity-0 animate-fade-scale-in"
        onClick={(e) => e.stopPropagation()}
        style={{ animationFillMode: 'forwards' }}
      >
        <div className="flex justify-between items-center p-4 border-b border-slate-200">
          <h2 className="text-xl font-bold text-secondary">{title}</h2>
          <button
            onClick={onClose}
            className="p-1 rounded-full text-slate-500 hover:bg-slate-200 hover:text-slate-800"
          >
            <XMarkIcon className="w-6 h-6" />
          </button>
        </div>
        {children}
      </div>
      <style>{`
        @keyframes fade-scale-in {
          from {
            opacity: 0;
            transform: scale(0.95);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
        .animate-fade-scale-in {
          animation: fade-scale-in 0.2s ease-out;
        }
      `}</style>
    </div>
  );
};

export default Modal;
