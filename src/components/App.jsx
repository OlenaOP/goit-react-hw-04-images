import React, { Component } from 'react';
import { Searchbar } from './Searchbar/Searchbar';
import { ImageGallery } from './ImageGallery/ImageGallery';
import { Modal } from './Modal/Modal';
import { fetchAllImagesByQuery, fetchImages } from '../services/api.js';
import { Button } from './Button/Button';
import { Loader } from './Loader/Loader';

export class App extends Component {
  state = {
    query: '',
    images: [],
    page: 1,
    isModalOpen: false,
    isLoading: false,
    error: null,
    loadMore: true,
    totalPages: 1,
    activeImage: null,
  };

  fetchAllImages = async () => {
    try {
      this.setState({
        isLoading: true,
      });
      const images = await fetchImages(this.state.query, this.state.page);
      // console.log('images.hits=', images.hits);
      // console.log('images=', this.state.images);
      // console.log('concat arr', this.state.images.concat(images.hits));
      this.setState(prevState => {
        if (this.state.page === 1) {
          return {
            images: images.hits,
            loadMore: this.state.page < this.state.totalPages,
          };
        } else {
          return {
            images: prevState.images.concat(images.hits),
            loadMore: this.state.page < this.state.totalPages,
          };
        }
      });
    } catch (error) {
      this.setState({ error: error.message });
    } finally {
      this.setState({
        isLoading: false,
      });
    }
  };

  totalPageCount = async () => {
    try {
      this.setState({
        isLoading: true,
      });
      const images = await fetchAllImagesByQuery(this.state.query);
      const pagesCount = Math.ceil(images.totalHits / 12);
      // console.log('images.hits=', images.hits);
      // console.log('images=', this.state.images);
      // console.log('concat arr', this.state.images.concat(images.hits));
      this.setState({ totalPages: pagesCount });
      console.log(
        'totalPages:',
        this.state.totalPages,
        Math.ceil(images.totalHits / 12)
      );
      console.log('totalHits:', images.totalHits);
    } catch (error) {
      this.setState({ error: error.message });
    } finally {
      this.setState({
        isLoading: false,
      });
    }
  };

  ClickHandlerLoadMore = () => {
    this.setState(prevState => {
      return {
        page: prevState.page + 1,
      };
    });
  };

  handleSubmit = evt => {
    evt.preventDefault();
    const form = evt.currentTarget;
    const search = form.elements.search.value;
    console.log(search);
    this.totalPageCount();
    this.setState({ query: search, page: 1 });
  };

  openModal = selectedImage => {
    this.setState({ activeImage: selectedImage, isModalOpen: true });
  };

  closeModal = () => {
    this.setState({ activeImage: null, isModalOpen: false });
  };

  componentDidMount = () => {
    this.state.query ?? this.fetchAllImages();
  };

  componentDidUpdate(_, prevState) {
    if (
      this.state.page !== prevState.page ||
      this.state.query !== prevState.query
    ) {
      this.fetchAllImages();
    }
  }

  // handleImageClick = image => {
  //   this.setState({ activeImage: image, showModal: true });
  //   document.body.style.overflow = 'hidden';
  // };

  render() {
    return (
      <div>
        <Searchbar onSubmit={this.handleSubmit} />
        {this.state.isLoading && <Loader />}
        {this.state.query && (
          <>
            <ImageGallery
              images={this.state.images}
              onImageClick={this.openModal}
            />
            {this.state.loadMore ? (
              <Button handleClick={this.ClickHandlerLoadMore} />
            ) : (
              <></>
            )}
          </>
        )}
        {this.state.isModalOpen && (
          <Modal
            image={this.state.activeImage}
            onCloseModal={this.closeModal}
          />
        )}
      </div>
    );
  }
}
