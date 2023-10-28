import css from './Modal.module.css';
import React from 'react';
import { useEffect } from 'react';

export const Modal = ({ image, onCloseModal }) => {
  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  const handleKeyDown = event => {
    if (event.code === 'Escape') {
      onCloseModal();
    }
  };

  const handleClick = event => {
    if (event.target === event.currentTarget) {
      onCloseModal();
    }
  };

  return (
    <div className={css.overlay} onClick={handleClick}>
      <div className={css.modal}>
        <img src={image.largeImageURL} alt={image.tags} />
      </div>
    </div>
  );
};
