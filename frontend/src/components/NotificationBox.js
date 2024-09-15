import React, { useEffect } from 'react';
import '../css/NotificationBox.css';

const NotificationBox = ({ message, onClose }) => {
    useEffect(() => {
        const timeout = setTimeout(() => {
            onClose();
        }, 4000); // Automatically close after 4 seconds

        return () => clearTimeout(timeout);
    }, [onClose]);

    return (
        <div className="notification-box" onClick={onClose}>
            <span className="close">&times;</span>
            <p>{message}</p>
        </div>
    );
};

export default NotificationBox;
