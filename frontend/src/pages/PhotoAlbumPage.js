import React, { useState, useEffect } from 'react';
import '../css/ProfilePage.css';
import HeaderClient from "../components/HeaderClient";
import HeaderProfilePage from "../components/HeaderProfilePage";
import PhotoPage from "../components/photoPage";
import { request } from '../axios/axios';
import PhotoAlbums from "../components/PhotoAlbums"


const PhotoAlbumPage = () => {
    const user = JSON.parse(localStorage.getItem("loggedUser"));
    const fullName = localStorage.getItem("fullName");
    const photoProfile = localStorage.getItem("photoProfile");
    const albumString = localStorage.getItem("selectedAlbum");
    const album = JSON.parse(albumString);
    return (
        <div>
            <HeaderClient/>
            <div className="profile-container">
                <div className="profile-header">
                    <img src={`${process.env.PUBLIC_URL}/${photoProfile}`} alt="profile" className="profile-picture" />
                    <h1>{fullName}</h1>

                </div>
                <div>
                    <h2 style={{marginRight:'90%'}}> Album: {album.name}</h2>
                </div>
                <div className="profile-content">
                    <button onClick={()=>{window.location.replace("http://localhost:3000/albums-page")}} className="back-button"> Back</button>
                    <PhotoAlbums />
                </div>
            </div>
        </div>
    );
};

export default PhotoAlbumPage;
