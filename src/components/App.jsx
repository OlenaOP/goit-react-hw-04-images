import React, { Component } from 'react';
import { Searchbar } from './Searchbar/Searchbar';
import { ImageGallery } from './ImageGallery/ImageGallery';
import { Modal } from './Modal/Modal';
import { fetchImages } from '../services/api.js';
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
    loadMore: false,
    totalPages: 1,
    activeImage: null,
  };

  fetchAllImages = async () => {
    try {
      this.setState({
        isLoading: true,
      });
      if (!this.state.query) {
        return;
      }

      const images = await fetchImages(this.state.query, this.state.page);
      const pagesCount = Math.ceil(images.totalHits / 12);
      this.setState({ totalPages: pagesCount });

      // console.log('totalPages=', this.state.totalPages);
      // console.log('Page=', this.state.page);
      // console.log('concat arr', this.state.images.concat(images.hits));
      this.setState(prevState => {
        if (this.state.page === 1) {
          return {
            images: images.hits,
            loadMore: this.state.page < pagesCount,
          };
        } else {
          return {
            images: prevState.images.concat(images.hits),
            loadMore: this.state.page < pagesCount,
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
