import React, { useState, useEffect } from 'react';
import '../css/ProfilePage.css';
import HeaderClient from "../components/HeaderClient";
import HeaderProfilePage from "../components/HeaderProfilePage";
import PhotoPage from "../components/photoPage";
import { request } from '../axios/axios';

const ProfilePage = () => {
    const user = JSON.parse(localStorage.getItem("loggedUser"));
    const fullName = localStorage.getItem("fullName");
    const photoProfile = localStorage.getItem("photoProfile");
    const [photoData, setPhotoData] = useState([]);

    useEffect(() => {
        const fetchPhotos = async () => {
            try {
                const response = await request('get', `/photo/${user.email}`);
                const data = response.data.map(photo => ({
                    id: photo.id,
                    url: `${process.env.PUBLIC_URL}/${user.email}/${photo.name}`
                }));
                setPhotoData(data);
            } catch (error) {
                console.error('Error fetching photos:', error);
            }
        };

        fetchPhotos();
    }, [user.email]);

    return (
        <div>
            <HeaderClient/>
            <div className="profile-container">
                <div className="profile-header">
                    <img src={photoProfile} alt="profile" className="profile-picture" />
                    <h1>{fullName}</h1>
                    <HeaderProfilePage/>
                </div>
                <div className="profile-content">
                    <PhotoPage photoData={photoData} setPhotoData={setPhotoData} />
                </div>
            </div>
        </div>
    );
};

export default ProfilePage;
