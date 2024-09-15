import React, { Component } from 'react';
import "../css/PhotoPage.css";
import { request } from "../axios/axios";
class AlbumModal extends Component {
  render() {
    const { isOpen, albums, onSelect, onClose } = this.props;
    if (!isOpen) {
      return null;
    }

    return (
        <div className="album-modal-background" onClick={onClose}>
          <div className="album-modal" onClick={e => e.stopPropagation()}>
            <ul>
              {albums.map(album => (
                  <li key={album.id} onClick={() => onSelect(album.id)}>
                    Albumul : {album.name}
                  </li>
              ))}
            </ul>
            <button onClick={onClose} className="album-modal-close">Close</button>
          </div>
        </div>
    );
  }
}

class PhotoPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      activeMenuIndex: null,
      albums: [],
      selectedPhotoId: null,
      isAlbumModalOpen: false,
    };
  }

  componentDidMount() {
    this.fetchAlbums();
  }

  fetchAlbums = async () => {
    try {
      const user = JSON.parse(localStorage.getItem("loggedUser"));
      const response = await request('get', `/albums/${user.email}`);
      this.setState({ albums: response.data });
    } catch (error) {
      console.error('Error fetching albums:', error);
    }
  };

  handleToggleMenu = (photoId, index) => {
    this.setState(prevState => ({
      activeMenuIndex: prevState.activeMenuIndex === index ? null : index,
      selectedPhotoId: photoId // Set the selected photo ID here for deletion or adding to album
    }));
  };

  handleDelete = async (photoId, index) => {
    try {
      await request('delete', `/photo/${photoId}`);
      console.log(`Photo with ID ${photoId} deleted successfully`);
      this.props.setPhotoData(prevData => prevData.filter((_, i) => i !== index));
    } catch (error) {
      console.error('Error deleting photo:', error);
    }
  };

  openAlbumModal = () => {
    this.setState({ isAlbumModalOpen: true });
  };

  handleAlbumSelect = async (albumId) => {
    const { selectedPhotoId } = this.state;
    if (!selectedPhotoId) {
      console.error('No photo selected.');
      return;
    }
    try {
      await request('patch', `/albums/add_photo/${albumId}/${selectedPhotoId}`);
      console.log(`Photo with ID ${selectedPhotoId} added to album with ID ${albumId} successfully`);
      this.setState({ activeMenuIndex: null, isAlbumModalOpen: false });
    } catch (error) {
      console.error('Error adding photo to album:', error);
    }
  };

  closeAlbumModal = () => {
    this.setState({ isAlbumModalOpen: false });
  };

  render() {
    const { photoData } = this.props;
    const { activeMenuIndex, albums, isAlbumModalOpen } = this.state;

    return (
        <div className="photo-container">
          {photoData.map((photo, index) => (
              <div key={photo.id} className="photo">
                <img src={photo.url} alt={`Photo ${index}`} />
                <div className="edit-button">
                  <button onClick={() => this.handleToggleMenu(photo.id, index)}>
                    &#8942;
                  </button>
                  {activeMenuIndex === index && (
                      <div className="edit-menu">
                        <ul>
                          <li onClick={() => this.handleDelete(photo.id, index)}>Delete photo</li>
                          <li onClick={this.openAlbumModal}>Add to album</li>
                        </ul>
                      </div>
                  )}
                </div>
              </div>
          ))}
          <AlbumModal
              isOpen={isAlbumModalOpen}
              albums={albums}
              onSelect={this.handleAlbumSelect}
              onClose={this.closeAlbumModal}
          />
        </div>
    );
  }
}

export default PhotoPage;
