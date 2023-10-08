import css from './ImageGalleryItem.module.css';

export const ImageGalleryItem = ({ id, webformatURL, alt }) => {
  return (
    <li key={id} className={css.ImageGalleryItem}>
      <img src={webformatURL} alt={alt} className={css.ImageGalleryItemImage} />
    </li>
  );
};
