import { useState, useEffect } from 'react';
import '../css/ProfilePage.css';
import HeaderClient from "../components/HeaderClient";
import HeaderProfilePage from "../components/HeaderProfilePage";
import EditProfileModal from "../components/EditProfileModal";
import React from 'react';
import { request } from '../axios/axios';
import EditProfilePictureModal from "../components/EditProfilePictureModal";
import NewPostBox from "../components/posts/NewPostBox";
import * as SockJS from 'sockjs-client';
import * as Stomp from 'stompjs';
import NotificationBox from "../components/NotificationBox";

const ProfilePage = () => {
    const [userData, setUserData] = useState({
        profilePicture: '',
        name: '',
        bio: '',
        study: '',
        home: '',
        work: '',
        birthplace: ''
    });
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isProfileEditOpen, setIsProfileEditOpen] = useState(false);
    const [stompClient, setStompClient] = useState(null);
    const [lastNotification, setLastNotification] = useState(null);
    localStorage.setItem("currentPage", "profile-page")
    useEffect(() => {
        const connect = () => {
            if (stompClient !== null) {
                stompClient.close();
            }
            console.log("In Connect");
            const URL = "http://localhost:8080/api/v1/socket/notification";
            const websocket = new SockJS(URL);
            const client = Stomp.over(websocket);
            const loggedUser = JSON.parse(localStorage.getItem('loggedUser'));
            client.connect({}, frame => {
                client.subscribe("/topic/friend_requests/" + `${loggedUser.email}`, notification => {
                    let message = notification.body;
                    setLastNotification(message); // Set last notification message
                });
                setStompClient(websocket); // Set the connected client
            });
        };
        const fetchUserData = async () => {
            const loggedUser = JSON.parse(localStorage.getItem('loggedUser'));
            try {
                const userDetailsResponse = await request('GET', `/personal_details/${loggedUser.email}`);
                if (userDetailsResponse.status === 200) {
                    const userDataFromServer = userDetailsResponse.data;
                    let photoPath;
                    if(userDataFromServer.profilePicture!=null) {
                        photoPath=process.env.PUBLIC_URL + loggedUser.email + '/'+ userDataFromServer.profilePicture.name;

                    }
                    else {
                        photoPath=process.env.PUBLIC_URL + 'profile.png';
                    }
                    console.log("Photo Path:", photoPath);
                    localStorage.setItem("photoProfile", photoPath);
                    console.log("Stored in localStorage:", localStorage.getItem("photoProfile"));

                    localStorage.setItem("fullName",`${loggedUser.firstName} ${loggedUser.lastName}`);
                    setUserData({
                            profilePicture: photoPath,
                            name: `${loggedUser.firstName} ${loggedUser.lastName}`,
                            bio: userDataFromServer.bio,
                            study: userDataFromServer.study,
                            home: userDataFromServer.home,
                            work: userDataFromServer.work,
                            birthplace: userDataFromServer.birthplace
                        });
                        localStorage.setItem("profilePicture", photoPath);
                    }
                 else {
                    console.error("Failed to fetch user data:", userDetailsResponse.statusText);
                }
            } catch (error) {
                console.error("Error fetching user data:", error);
            }
        };
        fetchUserData();
        connect();

        return () => {
            if (stompClient !== null) {
                stompClient.close();
            }
        }
    }, []);
    const handleProfilePictureSave = (newProfilePicturePath) => {
        setUserData(prevUserData => ({
            ...prevUserData,
            profilePicture: newProfilePicturePath,
        }));
    };

    const handleEdit = async (updatedData) => {
        const loggedUser = JSON.parse(localStorage.getItem('loggedUser'));
        try {
            const response = await request('PUT', `/personal_details/${loggedUser.email}`, updatedData);
            if (response.status === 200) {
                console.log("Profile updated successfully!");
                setUserData({
                    ...userData,
                    ...updatedData,
                });
                setIsModalOpen(false);
            } else {
                console.error("Failed to update profile:", response.statusText);
            }
        } catch (error) {
            console.error("Error updating profile:", error);
        }
    };
    const handleEditPictureClick = () => {
        console.log('Edit picture button clicked'); // Debug log
        setIsProfileEditOpen(true);
    };

    if(localStorage.getItem("clientLogged") === "false")
        window.location.replace("http://localhost:3000/")
    else
        return (
            <div>
                <HeaderClient />
                <div className="profile-container">
                    <div className="profile-header">
                        <div className="image-container">
                            <img src={userData.profilePicture} alt="profile" className="profile-picture" />
                            <div className="edit-button">
                                <button onClick={handleEditPictureClick}>
                                    <img src={process.env.PUBLIC_URL + '/edit.png'} alt="Edit" className="edit-icon" />
                                </button>
                            </div>
                        </div>
                        <h1>{userData.name}</h1>
                        <HeaderProfilePage />
                    </div>

                    <div className="profile-content">
                        <div className="profile-info">
                            <div className="info-section">
                                <p className="info-title">Bio:</p>
                                <p>{userData.bio}</p>
                            </div>
                            <div className="info-section">
                                <p className="info-title">Education:</p>
                                <p>{userData.study}</p>
                            </div>
                            <div className="info-section">
                                <p className="info-title">From:</p>
                                <p>{userData.home}</p>
                            </div>
                            <div className="info-section">
                                <p className="info-title">Work:</p>
                                <p>{userData.work}</p>
                            </div>
                            <div className="info-section">
                                <p className="info-title">Birthplace:</p>
                                <p>{userData.birthplace}</p>
                            </div>
                            <button className="edit-profile-button" onClick={() => setIsModalOpen(true)}>Edit Profile</button>
                        </div>
                    </div>
                    <div  className="profile-posts">
                        <NewPostBox />
                    </div>
                </div>
                <EditProfileModal
                    userData={userData}
                    isOpen={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                    onSave={handleEdit}
                />
                <EditProfilePictureModal
                    isOpen={isProfileEditOpen}
                    onClose={() => setIsProfileEditOpen(false)}
                    onSave={handleProfilePictureSave}
                />
                {lastNotification && (
                    <NotificationBox
                        message={lastNotification}
                        onClose={() => setLastNotification(null)}
                    />
                )}
            </div>
        );
};

export default ProfilePage;
