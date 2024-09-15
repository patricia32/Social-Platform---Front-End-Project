import React, { useState, useEffect } from 'react';
import { request } from "../axios/axios";
import "../css/PhotoPage.css";


function EditProfilePictureModal({ isOpen, onClose, onSave }) {
    const [selectedFile, setSelectedFile] = useState(null);
    const [photos, setPhotos] = useState([]);
    const [email, setEmail] = useState('');
    const loggedUser = JSON.parse(localStorage.getItem('loggedUser')) || {};

    useEffect(() => {
        const fetchPhotos = async () => {
            try {
                const response = await request('GET', `/photo/${loggedUser.email}`);
                setPhotos(response.data);
            } catch (error) {
                console.error('Failed to fetch photos:', error);
            }
        };

        if (isOpen) {
            setEmail(loggedUser.email);
            fetchPhotos();
        }
    }, [isOpen, loggedUser.email]);


    const fetchPhotos = async () => {
        try {
            const response = await request('GET', `/photo/${loggedUser.email}`);
            setPhotos(response.data);
        } catch (error) {
            console.error('Failed to fetch photos:', error);
        }
    };

    const handleFileChange = event => setSelectedFile(event.target.files[0]);

    const handleSave = async () => {
        if (selectedFile) {
            const photoName = selectedFile.name;
            console.log(photoName);

            const email = loggedUser.email;

            try {
                const url = `/profile_picture/${email}?profilePictureName=${encodeURIComponent(photoName)}`;

                console.log('Sending PUT request to:', url);

                // Send the PUT request
                await request('PUT', url);

                console.log("Profile picture updated successfully");
            } catch (error) {
                console.error('Error during profile picture update:', error);
            }
            window.location.reload()
        }
    };


    const handlePhotoSelect = async (selectedPhoto) => {
        const photoName = selectedPhoto;
        console.log(photoName);
        const email = loggedUser.email;

        try {
            const url = `/profile_picture/${email}?profilePictureName=${encodeURIComponent(photoName)}`;

            console.log('Sending PUT request to:', url);

            await request('PUT', url);

            console.log("Profile picture updated successfully");
        } catch (error) {
            console.error('Error during profile picture update:', error);
        }
        window.location.reload()    };



    if (!isOpen) return null;

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <button onClick={onClose} className="close-modal-button">X</button>
                <h2>Edit Profile Picture</h2>
                <input type="file" onChange={handleFileChange} />
                <div className="photo-list">
                    {photos.map(photo => (
                        <img
                            key={photo.id}
                            className="photo_edit"
                            src={`${process.env.PUBLIC_URL}/${email}/${photo.name}`}
                            alt="Profile"
                            onClick={() => handlePhotoSelect(photo.name)}
                        />
                    ))}
                </div>
                <button onClick={handleSave}>Upload New</button>
            </div>
        </div>
    );
}

export default EditProfilePictureModal;
