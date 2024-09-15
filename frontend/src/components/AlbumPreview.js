import React from 'react';
const AlbumPreview = ({ album, onSelectAlbum, onToggleMenu, isActive, onDeleteAlbum, onEditAlbum }) => {
    let coverPhotoUrl = album.photos.length > 0
        ? `${process.env.PUBLIC_URL}/${album.photos[0].idUser}/${album.photos[0].name}`
        : process.env.PUBLIC_URL + 'profile.png';
    const handleSelectAlbum = () => {
        localStorage.setItem('selectedAlbum', JSON.stringify(album));

        window.location.replace(`http://localhost:3000/photosAlbums/${album.id}`);

    };

    return (
        <div className="album-preview-container" onClick={onSelectAlbum}>
            <div className="album-cover-container" style={{ position: 'relative' }}>
                <img src={coverPhotoUrl} alt="Album Cover" className="album-cover-photo" onClick={handleSelectAlbum} />
                <div className="edit-button">
                    <button onClick={(e) => {
                        e.stopPropagation();
                        onToggleMenu();
                    }}>
                        &#8942;
                    </button>
                    {isActive && (
                        <div className="edit-menu">
                            <ul>
                                <li onClick={() => { onDeleteAlbum(); onToggleMenu(); }}>Delete album</li>
                                <li onClick={onEditAlbum}>Edit album</li>
                            </ul>
                        </div>
                    )}
                </div>
                <div className="album-name">{album.name}</div>
            </div>
        </div>
    );
};

export default AlbumPreview;
