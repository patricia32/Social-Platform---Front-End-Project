import React, { Component } from 'react';
import ModalCreatePost from "../modals/ModalCreatePost";
import PostsList from "./PostsList";

class NewPostBox extends Component {
    constructor(props) {
        super(props);
        this.state = {
        };
    }

    openModalCreatePost = () => {
        localStorage.setItem("modalCreatePostIsOpen", "true")
        window.location.reload()
    };
    render() {
        return(
            <div>
                <div className="post-input-container">
                    <img
                        src={localStorage.getItem("profilePicture")}
                        alt="Profile"
                        className="post-profile-picture"
                    />
                    <input
                        type="text"
                        placeholder="What's on your mind?"
                        onClick={this.openModalCreatePost}
                        className="whatsonyourmind-field"
                    />
                </div>
                <PostsList/>
                <ModalCreatePost/>
            </div>

        );
    }
}

export default NewPostBox;
