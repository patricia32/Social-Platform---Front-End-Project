import React, { useRef } from 'react';
import Modal from 'react-modal';
import '../css/AddAlbumModal.css';

Modal.setAppElement('#root');

const AddAlbumModal = ({ isOpen, onClose, onSubmit }) => {
    const albumNameRef = useRef(null);

    const handleFormSubmit = (e) => {
        e.preventDefault();
        const albumName = albumNameRef.current.value;
        if (albumName) {
            onSubmit(albumName);
        }
        onClose();
    };

    return (
        <Modal isOpen={isOpen} onRequestClose={onClose} className="modal">
            <div className="modal-content">
                <h2>Add New Album</h2>
                <form onSubmit={handleFormSubmit}>
                    <input
                        type="text"
                        ref={albumNameRef}
                        placeholder="Album Name"
                        required
                        className="input-field"
                    />
                    <button
                        type="submit"
                        className="button create-button"
                    >
                        Create Album
                    </button>
                    <button
                        type="button"
                        onClick={onClose}
                        className="button cancel-button"
                    >
                        Cancel
                    </button>
                </form>
            </div>
        </Modal>
    );
};

export default AddAlbumModal;
