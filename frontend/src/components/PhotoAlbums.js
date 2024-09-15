import React, { Component } from 'react';
import "../css/PhotoPage.css";
import { request } from "../axios/axios";

class PhotoAlbums extends Component {
    constructor(props) {
        super(props);
        this.state = {
            photoData: [],
            activeMenuIndex: null
        };
    }

    handleDelete = async (photoId, index) => {
        try {
            const albumString = localStorage.getItem("selectedAlbum");
            const album = JSON.parse(albumString);

            console.log(album.id);
            await request('patch', `/albums/remove_photo/${album.id}/${photoId}`);
            console.log(`Photo with ID ${photoId} deleted successfully`);
            this.setState(prevState => ({
                photoData: prevState.photoData.filter((photo) => photo.id !== photoId),
                activeMenuIndex: null
            }));        } catch (error) {
            console.error('Error deleting photo:', error);
        }
    };
    componentDidMount() {
        const album = localStorage.getItem("selectedAlbum");
        const parsedAlbum = album ? JSON.parse(album) : null;

        if (parsedAlbum && parsedAlbum.photos) {
            this.setState({ photoData: parsedAlbum.photos });
        }
    }
    handleToggleMenu = (photoId, index) => {
        this.setState(prevState => ({
            activeMenuIndex: prevState.activeMenuIndex === index ? null : index,
            selectedPhotoId: photoId
        }));
    };
    render() {
        const { photoData } = this.state;
        const { activeMenuIndex } = this.state;


        return (
            <div className="photo-container">

                {photoData.map((photo, index) => (
                    <div key={photo.id} className="photo">
                        <img src={`${process.env.PUBLIC_URL}/${photo.idUser}/${photo.name}`} alt={`Photo ${index}`} />                        <div className="edit-button">
                            <button onClick={() => this.handleToggleMenu(photo.id, index)}>
                                &#8942;
                            </button>
                            {activeMenuIndex === index && (
                                <div className="edit-menu">
                                    <ul>
                                        <li onClick={() => this.handleDelete(photo.id, index)}>Delete photo</li>
                                    </ul>
                                </div>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        );
    }
}

export default PhotoAlbums;
