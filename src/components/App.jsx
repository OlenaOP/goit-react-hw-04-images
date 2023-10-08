import React, { Component } from 'react';
import { Searchbar } from './Searchbar/Searchbar';
import { ImageGallery } from './ImageGallery/ImageGallery';
import { Modal } from './Modal/Modal';
import { fetchImages } from '../services/api.js';

export class App extends Component {
  state = {
    images: [],
    page: 1,
    isModalOpen: false,
    isLoading: false,
    error: null,
  };

  fetchAllImages = async () => {
    try {
      const images = await fetchImages();
      console.log(images.hits);
      this.setState({
        images: images.hits,
      });
    } catch (error) {
      this.setState({ error });
    }
  };

  componentDidMount = () => {
    this.fetchAllImages();
  };

  render() {
    return (
      <div>
        <Searchbar />
        <ImageGallery images={this.state.images} />
        <Modal />
      </div>
    );
  }
}
