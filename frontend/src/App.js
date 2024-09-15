import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'; // Correct import
import './App.css';
import RegistrationPage from "./pages/RegistrationPage";
import RequestList from "./pages/RequestListPage";
import SidebarMenuAdmin from "./components/SidebarMenuAdmin";
import LoginPage from "./pages/LoginPage";
import ProfilePage from "./pages/ProfilePage"
import PhotoPage from "./pages/ProfilePagePhoto"
import ProfilePagePhoto from "./pages/ProfilePagePhoto";
import AlbumsPage from "./pages/AlbumsPage";
import PhotoAlbumPage from "./pages/PhotoAlbumPage";
import Chat from "./pages/Chat";
import Feed from "./pages/Feed";



class App extends Component {
    state = {
        isSidebarOpen: false,
    };

    toggleSidebar = () => {
        this.setState(prevState => ({
            isSidebarOpen: !prevState.isSidebarOpen
        }));
    };

    render() {
        return (
            <Router>
                <div className="App">
                    <Routes>
                        <Route path="/register" element={<RegistrationPage />} />
                        <Route path="/" element={<LoginPage />} />
                        <Route path="/profile-about" element={<ProfilePage />} />
                        <Route path="/profile-photo" element={<ProfilePagePhoto />} />
                        <Route path="/albums-page" element={<AlbumsPage />} />
                        <Route path="/photosAlbums/:id" element={<PhotoAlbumPage />} />
                        <Route path="/chat" element={<Chat />} />
                        <Route path="/request-list" element={<RequestList />} />
                        <Route path="/sidebar-menu-admin" element={<SidebarMenuAdmin />} />
                        <Route path="/feed" element={<Feed />} />
                    </Routes>
                    <footer className="App-footer" >
                        © Copyright 2024
                    </footer>
                </div>
            </Router>
        );
    }
}

export default App;
