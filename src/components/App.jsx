import React, { Component } from 'react';
import { Searchbar } from './Searchbar/Searchbar';
import { ImageGallery } from './ImageGallery/ImageGallery';
import { Modal } from './Modal/Modal';
import { fetchImages } from '../services/api.js';
import { fetchMoreImages } from '../services/api.js';

// const Button = () => {
//   return (
//     <button
//       type="button"
//       onClick={fetchMoreImages(this.state.query, this.state.page)}
//     >
//       Load more..
//     </button>
//   );
// };

export class App extends Component {
  state = {
    query: null,
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
      const images = await fetchImages(this.state.query);
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

  handleSubmit = evt => {
    evt.preventDefault();
    const form = evt.currentTarget;
    const search = form.elements.search.value;
    console.log(search);
    this.setState({ query: search });
  };

  componentDidMount = () => {
    {
      this.state.query ?? this.fetchAllImages();
    }
  };

  render() {
    return (
      <div>
        <Searchbar onSubmit={this.handleSubmit} />
        {this.state.query ?? (
          <>
            <ImageGallery images={this.state.images} />
            {/* <Button /> */}
          </>
        )}
        <Modal />
      </div>
    );
  }
}
