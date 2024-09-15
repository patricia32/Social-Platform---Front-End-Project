import React, { Component } from "react";
import '../css/RegistrationRequest.css';
import '../css/FriendRequests.css';
import homeIcon from '../images/home.png';
import profileIcon from '../images/profileicon.png';
import FriendRequestsIcon from '../images/friendRequests.png'
import { request } from "../axios/axios";
import FriendRequestsPopup from "./FriendRequestsPopup";
import SearchBar from "./SearchBar";
import ChatListPopup from "./ChatListPopup";
import chatIcon from '../images/chat.png';

class HeaderAdmin extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isPopupOpen: false,
            isPopupChatOpen: false,
            friendRequests: [],
            friendsListChat: []
        };
    }
    handleLogOut = () => {
        localStorage.clear();
        window.location.replace("http://localhost:3000/");
    };

    navigateToHome = () => {
        console.log("Home clicked");
        window.location.replace("http://localhost:3000/feed")
    };

    navigateToProfile = () => {
        console.log("Profile clicked");
        window.location.replace("http://localhost:3000/profile-about")
    };

    getFriendRequests = () => {
        this.closePopupChat()
        const loggedUser = JSON.parse(localStorage.getItem('loggedUser'));
        request('GET', `/friends/request/${loggedUser.email}`)
            .then(res => {
                this.setState({ friendRequests: res.data, isPopupOpen: true });
            })
            .catch(error => {
                console.error("Error fetching requests:", error);
            });
    }

    getFriends = () => {
        this.closePopup()
        const loggedUser = JSON.parse(localStorage.getItem('loggedUser'));
        request('GET', `/friends/${loggedUser.email}`)
            .then(res => {
                this.setState({ friendsListChat: res.data, isPopupChatOpen: true });
            })
            .catch(error => {
                console.error("Error fetching requests:", error);
            });
    }
    closePopupChat = () => {
        this.setState({ isPopupChatOpen: false });
    }

    acceptFriendship = (emailSender) => {
        const emailReceiver = JSON.parse(localStorage.getItem('loggedUser')).email;
        const emails = { emailSender: emailSender, emailReceiver: emailReceiver}
        request('PATCH', `/friends/accept`, emails)
            .then(res => {
            })
            .catch(error => {
                console.error("Error fetching people:", error);
            });
    }

    denyFriendship = (emailSender) => {
        const emailReceiver = JSON.parse(localStorage.getItem('loggedUser')).email;
        const emails = { emailSender: emailSender, emailReceiver: emailReceiver}
        request('DELETE', `/friends/deny`, emails)
            .then(res => {
            })
            .catch(error => {
                console.error("Error fetching people:", error);
            });
    }
    closePopup = () => {
        this.setState({ isPopupOpen: false });
    }
    render() {
        const { isPopupOpen, friendRequests, isPopupChatOpen, friendsListChat } = this.state;
        return (
            <header className="App-header-user">
                <div className="App-header-left">
                    <span
                        style={{cursor:'pointer'}}
                        onClick={this.navigateToHome} >Social Platform</span>
                </div>
                <div className="App-header-center">
                    <SearchBar/>
                    <img src={homeIcon} alt="Home" className="nav-icon" onClick={this.navigateToHome} />
                    <img src={profileIcon} alt="Profile" className="nav-icon" onClick={this.navigateToProfile} />
                    <img src={FriendRequestsIcon} alt="FriendRequests" className="nav-icon" onClick={this.getFriendRequests}/>
                    <img src={chatIcon} alt="Chat" className="nav-icon" onClick={this.getFriends} />
                </div>
                <div className="App-header-right">
                    <button className="LogOutButton" onClick={this.handleLogOut}>Log out</button>
                </div>
                <FriendRequestsPopup
                    isOpen={isPopupOpen}
                    friendRequests={friendRequests}
                    acceptFriendship={this.acceptFriendship}
                    denyFriendship={this.denyFriendship}
                    closePopup={this.closePopup}
                />
                <ChatListPopup
                    isOpen={isPopupChatOpen}
                    friendsListChat={friendsListChat}
                    closePopupChat={this.closePopupChat}
                />
            </header>
        );
    }
}

export default HeaderAdmin;
