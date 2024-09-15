import React, { Component } from 'react';
import '../css/FriendRequests.css';
import { request } from "../axios/axios";
import CircularProgress from "@material-ui/core/CircularProgress";
import { useState } from 'react';

function addFriend(emailReceiver) {
    let emailSender = JSON.parse(localStorage.getItem("loggedUser")).email;
    let emails = {emailSender, emailReceiver}
    request('POST', `/friends/add`, emails)
        .then(res => {
            this.setState({ foundPeople: res.data })
        })
        .catch(error => {
            console.error("Error fetching people:", error);
        })
    return undefined;
}

const Person = ({ person }) => {
    const [isLoading, setIsLoading] = useState(false);

    const addFriend = (emailReceiver) => {
        // Logic to add friend
        setIsLoading(true)
        let emailSender = JSON.parse(localStorage.getItem("loggedUser")).email;
        let emails = {emailSender, emailReceiver}
        console.log(emails)
        request('POST', `/friends/add`, emails)
            .then(res => {

            })
            .catch(error => {
                console.error("Error fetching people:", error);
            })
            .finally(setIsLoading(false))
    };

    return (
        <div style={{ display: "flex", alignItems: "center" }}>
            <div className="search-header">
                <img
                    className="post-box-profile-picture"
                    src={person.profilePictureName ? `${person.email}/${person.profilePictureName}` : 'profile.png'}
                    alt="Profile"
                />
                <p className="search-name">{`${person.firstName} ${person.lastName}`}</p>
            </div>
            {isLoading ? (
                <CircularProgress />
            ) : (
                <React.Fragment>
                    {person.areFriends ? (
                        <p></p>
                    ) : (
                        <button className="addFriendButton" onClick={() => addFriend(person.email)}>Add Friend</button>
                    )}
                </React.Fragment>
            )}
        </div>
    );
};


const PeopleList = ({ people }) => (
    <div className="people-list">
        {people.map(person => (
            <Person key={person.email} person={person} />
        ))}
    </div>
);



const Popup = ({ isOpen, onClose, children }) => (
    isOpen && (
        <div className="popup">
            <div className="popup-content">
                <span className="close" onClick={onClose}>&times;</span>
                {children}
            </div>
        </div>
    )
);

class SearchBar extends Component {
    constructor(props) {
        super(props);
        this.state = {
            searchedName: "",
            foundPeople: [],
            isPopupOpen: false,
            filteredPeople: []
        };
        this.loggedUser = JSON.parse(localStorage.getItem("loggedUser"));
        this.getPeople()
    }

    handleChange = (e) => {
        const { name, value } = e.target;
        this.setState({ [name]: value }, () => {
            const { foundPeople, searchedName } = this.state;
            const filteredPeople = foundPeople.filter(person => {
                const fullName = `${person.firstName} ${person.lastName}`;
                return fullName.toLowerCase().includes(searchedName.toLowerCase());
            });
            this.setState({ filteredPeople });
            if(this.state.isPopupOpen === false)
                this.togglePopup()
        });
    }

    togglePopup = () => {
        this.setState(prevState => ({ isPopupOpen: !prevState.isPopupOpen }));
    }

    getPeople = () => {
        this.setState({ isLoading: true });
        request('GET', `/search/${this.loggedUser.email}`)
            .then(res => {
                this.setState({ foundPeople: res.data })
            })
            .catch(error => {
                console.error("Error fetching people:", error);
            })
            .finally(() => {
                this.setState({ isLoading: false });
            });
    }

    render() {
        const { filteredPeople, isPopupOpen } = this.state;

        return (
            <div>
                <div className="search-input-container">
                    <input
                        type="text"
                        name="searchedName"
                        placeholder="Find people"
                        onChange={this.handleChange}
                        className="search-field"
                    />
                </div>
                <Popup isOpen={isPopupOpen} onClose={this.togglePopup}>
                    <PeopleList people={filteredPeople} />
                </Popup>
            </div>
        );
    }
}

export default SearchBar;
