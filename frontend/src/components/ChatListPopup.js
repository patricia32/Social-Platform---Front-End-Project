import React from "react";
import '../css/FriendRequests.css'
const startChat = (emailSelectedFriend, firstNameSelectedFriend, lastNameSelectedFriend, profilePictureName) => {
    localStorage.setItem('emailSelectedFriend', emailSelectedFriend)
    localStorage.setItem('nameSelectedFriend', firstNameSelectedFriend + " " + lastNameSelectedFriend)
    localStorage.setItem('profilePictureNameSelectedFriend', profilePictureName)
    window.location.replace("http://localhost:3000/chat")
}
const ChatListPopup = ({ isOpen, friendsListChat, closePopupChat }) => (

    isOpen && (
        <div className="popup" onClick={closePopupChat}>
            <div className="popup-content">
                <span className="close">&times;</span>
                {friendsListChat.length > 0 ? (
                    <div className="people-list">
                        {friendsListChat.map(person => (
                            <div
                                key={person.email}
                                className="search-header"
                                style={{cursor: 'pointer'}}
                                onClick={() => startChat(person.email, person.firstName, person.lastName, person.profilePictureName)}
                            >
                                <img
                                    className="notif-profile-picture"
                                    src={person.profilePictureName ? `${person.email}/${person.profilePictureName}` : 'profile.png'}
                                    alt="Profile"
                                />
                                <p className="search-name">{`${person.firstName} ${person.lastName}`}</p>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p>Add new friends</p>
                )}
            </div>
        </div>
    )
);

export default ChatListPopup;