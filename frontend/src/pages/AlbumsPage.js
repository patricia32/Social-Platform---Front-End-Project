import React, { useState, useEffect } from 'react';
import HeaderClient from "../components/HeaderClient";
import HeaderProfilePage from "../components/HeaderProfilePage";
import AddAlbumModal from "../components/AddAlbumModal";
import AlbumPreview from "../components/AlbumPreview";
import EditAlbumModal from "../components/EditAlbumModal";
import { request } from '../axios/axios';
import '../css/AlbumsPage.css';

const AlbumsPage = () => {
  const [albums, setAlbums] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [activeMenuIndex, setActiveMenuIndex] = useState(null);
  const [selectedAlbum, setSelectedAlbum] = useState(null);
  const user = JSON.parse(localStorage.getItem("loggedUser"));
  const fullName = localStorage.getItem("fullName");
  const photoProfile = localStorage.getItem("photoProfile");

  useEffect(() => {
    fetchAlbums();
  }, [user.email]);

  const fetchAlbums = async () => {
    const response = await request('get', `/albums/${user.email}`);
    setAlbums(response.data);
  };

  const handleCreateAlbum = async (albumName) => {
    const createAlbumDTO = { name: albumName, idUser: user.email };
    await request('post', '/albums', createAlbumDTO);
    fetchAlbums();
  };

  const handleToggleMenu = (index) => {
    setActiveMenuIndex(activeMenuIndex === index ? null : index);
  };

  const handleDeleteAlbum = async (albumId) => {
    await request('delete', `/albums/${albumId}`);
    fetchAlbums();
    setActiveMenuIndex(null);
  };

  const handleEditAlbum = () => {
    setEditModalOpen(true);
  };

  const onSelectAlbum = (album) => {
    setSelectedAlbum(album);
  };

  const applyAlbumEdit = async (newName) => {
    if (selectedAlbum) {
      await request('patch', `/albums/${selectedAlbum.id}/${newName}`);
      fetchAlbums();
      setEditModalOpen(false);
    }
  };
  const handleMenuClose = () => {
    setActiveMenuIndex(null);
  };
  return (
      <div>
        <HeaderClient />
        <div className="profile-container">
          <div className="profile-header">
            <img src={photoProfile} alt="profile" className="profile-picture" />
            <h1>{fullName}</h1>
            <HeaderProfilePage />
          </div>
          <div className="profile-content">
            <div className="albums-container">
              <div className="album-square" onClick={() => setIsModalOpen(true)}>
                <div className="add-album">+</div>
              </div>
              {albums.map((album, index) => (
                  <AlbumPreview
                      key={album.id}
                      album={album}
                      onSelectAlbum={() => onSelectAlbum(album)}
                      onToggleMenu={() => handleToggleMenu(index)}
                      isActive={activeMenuIndex === index}
                      onDeleteAlbum={() => handleDeleteAlbum(album.id)}
                      onEditAlbum={() => { setSelectedAlbum(album); handleEditAlbum(); }}
                      onMenuClose={handleToggleMenu}
                  />
              ))}

            </div>
          </div>
          <AddAlbumModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onSubmit={handleCreateAlbum} />
          <EditAlbumModal
              isOpen={editModalOpen}
              onClose={() => setEditModalOpen(false)}
              onSubmit={(newName) => applyAlbumEdit(newName)}
              onCloseMenu={handleMenuClose}
              currentName={selectedAlbum ? selectedAlbum.name : ''}
          />

        </div>
      </div>
  );
};

export default AlbumsPage;
