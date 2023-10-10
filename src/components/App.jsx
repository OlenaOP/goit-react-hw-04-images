import React, { Component } from 'react';
import { Searchbar } from './Searchbar/Searchbar';
import { ImageGallery } from './ImageGallery/ImageGallery';
import { Modal } from './Modal/Modal';
import { fetchImages } from '../services/api.js';
import { Button } from './Button/Button';

// const Button = () => {
//   return (
//     <button type="button" onClick={this.fetchAllImages()}>
//       Load more..
//     </button>
//   );
// };

export class App extends Component {
  state = {
    query: '',
    images: [],
    page: 1,
    isModalOpen: false,
    isLoading: false,
    error: null,
  };

  fetchAllImages = async () => {
    try {
      this.setState({
        isLoading: true,
      });
      const images = await fetchImages(this.state.query, this.state.page);
      console.log(images.hits);
      this.setState({
        images: images.hits,
      });
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
      return { page: prevState.page + 1 };
    });
  };

  handleSubmit = evt => {
    evt.preventDefault();
    const form = evt.currentTarget;
    const search = form.elements.search.value;
    console.log(search);
    this.setState({ query: search });
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
            <Button handleClick={this.ClickHandler} />
          </>
        )}
        <Modal />
      </div>
    );
  }
}
