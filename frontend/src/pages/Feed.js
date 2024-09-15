import React, { Component } from 'react';
import { Link } from "react-router-dom";
import { request, setAuthHeader } from "../axios/axios";
import ModalResetPassword from "../components/modals/ModalResetPassword";
import CircularProgress from "@material-ui/core/CircularProgress";
import HeaderClient from "../components/HeaderClient";
import NewPostBox from "../components/posts/NewPostBox";
import '../css/ProfilePage.css';

class Feed extends Component {
    constructor(props) {
        super(props);
        this.state = {
        };
        localStorage.setItem("currentPage", "feed")
    }

    render() {
        if(localStorage.getItem("clientLogged") === "false")
            window.location.replace("http://localhost:3000/")
        else
            return (
                <div>
                    <HeaderClient/>
                    <div className="profile-container" >
                        <div className="profile-content">
                            <NewPostBox />
                        </div>
                    </div>
                </div>
            );
    }
}

export default Feed;
