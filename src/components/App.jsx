import React from 'react';
import { useState, useEffect } from 'react';

import { Searchbar } from './Searchbar/Searchbar';
import { ImageGallery } from './ImageGallery/ImageGallery';
import { Modal } from './Modal/Modal';
import { fetchImages } from '../services/api.js';
import { Button } from './Button/Button';
import { Loader } from './Loader/Loader';

export const App = () => {
  // state = {
  //   query: '',
  //   images: [],
  //   page: 1,
  //   isModalOpen: false,
  //   isLoading: false,
  //   error: null,
  //   loadMore: false,
  //   totalPages: 1,
  //   activeImage: null,
  // };
  const [query, setQuery] = useState('');
  const [images, setImages] = useState([]);
  const [page, setPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [loadMore, setLoadMore] = useState(false);
  const [totalPages, setTotalPages] = useState(1);
  const [activeImage, setActiveImage] = useState(null);

  const fetchAllImages = async () => {
    try {
      setIsLoading(true);
      if (query === '') {
        return;
      }

      const allImages = await fetchImages(query, page);
      if (allImages.hits.length === 0) {
        // images not found
        return alert('Sorry image not found...');
      }
      const pagesCount = Math.ceil(allImages.totalHits / 12);
      setTotalPages(pagesCount);

      // console.log('totalPages=', this.state.totalPages);
      // console.log('Page=', this.state.page);
      // console.log('concat arr', this.state.images.concat(images.hits));
      if (page === 1) {
        setImages(allImages.hits);
        setLoadMore(page < pagesCount);
      } else {
        setImages(prevState => [...prevState, ...allImages.hits]);
        setLoadMore(page < pagesCount);
      }
    } catch (error) {
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const ClickHandlerLoadMore = () => {
    setPage(prevState => prevState + 1);
  };

  const handleSubmit = evt => {
    evt.preventDefault();
    const form = evt.currentTarget;
    const search = form.elements.search.value;
    console.log(search);

    setQuery(search);
    setPage(1);
  };

  const openModal = selectedImage => {
    setActiveImage(selectedImage);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setActiveImage(null);
    setIsModalOpen(false);
  };

  // componentDidMount = () => {
  //   this.state.query ?? this.fetchAllImages();
  // };

  // componentDidUpdate(_, prevState) {
  //   if (
  //     this.state.page !== prevState.page ||
  //     this.state.query !== prevState.query
  //   ) {
  //     this.fetchAllImages();
  //   }
  // }
  useEffect(() => {
    query ?? fetchAllImages();
  }, []);

  useEffect(() => {
    console.log('изменился page or query');
    fetchAllImages();
  }, [page, query]);

  return (
    <div>
      <Searchbar onSubmit={handleSubmit} />
      {isLoading && <Loader />}
      {query !== '' && (
        <>
          <ImageGallery images={images} onImageClick={openModal} />
          {loadMore ? <Button handleClick={ClickHandlerLoadMore} /> : <></>}
        </>
      )}
      {isModalOpen && <Modal image={activeImage} onCloseModal={closeModal} />}
    </div>
  );
};
