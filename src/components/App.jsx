import React, { Component } from 'react';
import { Searchbar } from './Searchbar/Searchbar';
import { ImageGallery } from './ImageGallery/ImageGallery';
import { Modal } from './Modal/Modal';
import { fetchAllImagesByQuery, fetchImages } from '../services/api.js';
import { Button } from './Button/Button';

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
        return {
          images: prevState.images.concat(images.hits),
          loadMore: this.state.page < this.state.totalPages,
        };
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
      // console.log('images.hits=', images.hits);
      // console.log('images=', this.state.images);
      // console.log('concat arr', this.state.images.concat(images.hits));
      this.setState({ totalPages: Math.ceil(images.totalHits / 12) });
    } catch (error) {
      this.setState({ error: error.message });
    } finally {
      this.setState({
        isLoading: false,
      });
    }
  };

  ClickHandler = () => {
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
    this.setState({ query: search, page: 1, images: [] });
    this.totalPageCount();
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
        {this.state.isLoading && <p>Loading...</p>}
        {this.state.query && (
          <>
            <ImageGallery images={this.state.images} />
            {this.state.loadMore ? (
              <Button handleClick={this.ClickHandler} />
            ) : (
              <></>
            )}
          </>
        )}
        <Modal />
      </div>
    );
  }
}
