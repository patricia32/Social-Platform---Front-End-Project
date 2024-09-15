import React from "react";

const FriendRequestsPopup = ({ isOpen, friendRequests, acceptFriendship, denyFriendship, closePopup }) => (
    isOpen && (
        <div className="popup" onClick={closePopup}>
            <div className="popup-content">
                <span className="close">&times;</span>
                {friendRequests.length > 0 ? (
                    <div className="people-list">
                        {friendRequests.map(person => (
                            <div key={person.email} className="search-header">
                                <img
                                    className="notif-profile-picture"
                                    src={person.profilePictureName ? `${person.email}/${person.profilePictureName}` : 'profile.png'}
                                    alt="Profile"
                                />
                                <p className="search-name">{`${person.firstName} ${person.lastName}`}</p>
                                <button className="accept-remove-button" onClick={() => acceptFriendship(person.email)}>Accept</button>
                                <button className="accept-remove-button" onClick={() => denyFriendship(person.email)}>Remove</button>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p>No friend requests</p>
                )}
            </div>
        </div>
    )
);

export default FriendRequestsPopup;
