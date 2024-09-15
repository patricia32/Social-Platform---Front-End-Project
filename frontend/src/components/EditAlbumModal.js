import React, { useState, useEffect } from 'react';
import Modal from 'react-modal';

const EditAlbumModal = ({ isOpen, onClose, onSubmit, onCloseMenu }) => {
    const [newName, setNewName] = useState('');

    useEffect(() => {
        if (isOpen) {
            setNewName('');
        }
    }, [isOpen]);

    const handleSubmit = () => {
        onSubmit(newName);
        onCloseMenu();
        onClose();
    };

    return (
        <Modal isOpen={isOpen} onRequestClose={onClose} className="modal">
            <div className="modal-content">
                <input
                    type="text"
                    placeholder="New album name"
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                />
                <button onClick={handleSubmit} className="button create-button">
                    Save Changes
                </button>
                <button onClick={onClose} className="button cancel-button">
                    Cancel
                </button>
            </div>
        </Modal>
    );
};

export default EditAlbumModal;
