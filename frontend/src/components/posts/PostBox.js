import React, {Component} from 'react';
import {request} from "../../axios/axios";
import CircularProgress from "@material-ui/core/CircularProgress";
import ModalEditPost from "../modals/ModalEditPost";

class PostBox extends Component {
    constructor(props) {
        super(props);
        this.state = {
            menuVisible: false,
            isLoading: false,
            photoDeleted: 0,
            isEditModalOpen: false
        };
        this.loggedUser = JSON.parse(localStorage.getItem('loggedUser'));
    }
    toggleMenu = () => {
        this.setState(prevState => ({
            menuVisible: !prevState.menuVisible
        }));
    }

    formatTimestamp = (isoString) => {
        const date = new Date(isoString);
        const options = { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' };
        return new Intl.DateTimeFormat('en-US', options).format(date).replace(',', ' at');
    }

    openModalEditPost = () => {
        this.setState({isEditModalOpen: true})
        localStorage.setItem("modalEditPostIsOpen", "true")
    };
    deletePhotoPythonScript = () => {
        const formData = new FormData();
        formData.append('photo', this.props.post.photoName);
        formData.append('userEmail', this.loggedUser.email)
        fetch('http://localhost:5000/delete-photo', {
            method: 'DELETE',
            body: formData,
        })
            .then(response => {
                if (response.ok)
                    return response.text();
            })
            .then(data => {
                console.log('Photo deleted successfully!' + data);
                this.setState({photoDeleted: 2})
            })
            .catch(error => {
                console.error('Error:', error);
            });

    }

    componentDidUpdate(prevProps, prevState) {
        if (this.state.photoDeleted !== prevState.photoDeleted) {
            console.log('photoDeleted has been updated');
        }
    }
    handleDelete = () => {
        this.setState({isLoading: true });
        request('DELETE',`/posts/${this.props.post.id}`)
            .then(
                res => {
                    if(this.props.post.photoName !== "" && this.props.post.photoName !== null){
                        this.setState({ photoSaved: 1 });
                        this.deletePhotoPythonScript()

                    }

                    if(this.state.photoDeleted === 2 || this.state.photoDeleted === 0){
                        this.setState({photoDeleted: 0})
                        this.setState({isLoading: false });
                        window.location.replace("http://localhost:3000/profile-about")
                    }
                }
            )
            .catch(error => {
                console.log(error)
                this.setState({ isLoading: false });
            });
    }
    photoPath;

    render() {
        const { description, photoName, timestamp, friend  } = this.props.post;
        if(photoName === null || photoName === "")
            this.photoPath = ""
        else
            this.photoPath = this.loggedUser.email + '/' + photoName;
        if(this.state.isLoading)
            return (
                <div className="post-container">
                    <div className="post-header">
                        <img
                            src={localStorage.getItem("profilePicture")}
                            alt="Profile"
                            className="post-box-profile-picture"
                        />
                        <p className="post-name-date">
                            {localStorage.getItem("currentPage") === "feed" ? (
                                <>
                                    <span className="name">{friend.firstName} {friend.lastName}</span>
                                </>
                            ) : (
                                <>
                                    <span className="name">{this.loggedUser.firstName} {this.loggedUser.lastName}</span>
                                </>
                            )}
                            <span className="date">{this.formatTimestamp(timestamp)}</span>
                        </p>


                    </div>
                    <CircularProgress style={{bottom: "15px"}}/>
                </div>
            )
        else
        return(
            <div className="post-container">
                <div className="post-header">
                    {localStorage.getItem("currentPage") === "feed" ? (
                        <> <img
                            src={friend.email+'/'+friend.profilePictureName} // Replace with the path to your PNG profile picture with transparency
                            alt="Profile"
                            className="post-box-profile-picture"
                        />
                    </>
                    ):
                        (
                            <img
                                src={localStorage.getItem("profilePicture")} // Replace with the path to your PNG profile picture with transparency
                                alt="Profile"
                                className="post-box-profile-picture"
                            />
                        )}

                    <p className="post-name-date">
                        {localStorage.getItem("currentPage") === "feed" ? (
                            <>
                                <span className="name">{friend.firstName} {friend.lastName}</span>
                            </>
                        ) : (
                            <>
                                <span className="name">{this.loggedUser.firstName} {this.loggedUser.lastName}</span>
                            </>
                        )}
                        <span className="date">{this.formatTimestamp(timestamp)}</span>
                    </p>

                    <div>
                        {localStorage.getItem("currentPage") === "profile-page" && (
                            <>
                                <div onClick={this.toggleMenu} style={{ cursor: 'pointer', position: 'absolute', right: 20, top: 15 }}>
                                    &#8942; {/* HTML entity for the vertical ellipsis icon */}
                                </div>
                                {this.state.menuVisible && (
                                    <div style={{
                                        position: 'absolute',
                                        right: 0,
                                        backgroundColor: 'white',
                                        boxShadow: '0 2px 5px rgba(0,0,0,0.2)',
                                        zIndex: 100
                                    }}>
                                        <div style={{ padding: '8px 20px', cursor: 'pointer' }} onClick={this.openModalEditPost}>Edit</div>
                                        <div style={{ padding: '8px 20px', cursor: 'pointer' }} onClick={this.handleDelete}>Delete</div>
                                        <ModalEditPost isOpen={this.state.isEditModalOpen} post={this.props.post} />
                                    </div>
                                )}
                            </>
                        )}
                    </div>

                </div>
                <div className="post-content">
                    <span className="post-description">
                        {description}
                    </span>
                    {localStorage.getItem("currentPage") === "feed" ? (
                       <>
                           {photoName !== "" && photoName !== null && (
                               <img src={friend.email+'/'+photoName}
                                    alt="Post picture"
                                    className="post-picture"/>
                           )}
                       </>
                    ) : (
                        <>
                            {this.photoPath !== "" && (
                                <img src={this.photoPath}
                                     alt="Post picture"
                                     className="post-picture"/>
                            )}
                        </>
                    )}

                </div>
            </div>

        );
    }
}
export default PostBox;
