import { ImageGalleryItem } from '../ImageGalleryItem/ImageGalleryItem';
import css from './ImageGallery.module.css';

export const ImageGallery = ({ images }) => {
  console.log(images);
  return (
    <ul className={css.ImageGallery}>
      {images.map(img => {
        return (
          <ImageGalleryItem
            key={img.id}
            id={img.id}
            webformatURL={img.webformatURL}
            alt={img.tags}
          />
        );
        // return (
        //   <li key={img.id}>
        //     <img src={img.webformatURL} alt={img.tags} />
        //   </li>
        // );
      })}
    </ul>
  );
};
