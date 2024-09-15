import React, { Component } from 'react';

import {request} from "../../axios/axios";
import {Button} from "reactstrap";
import Modal from "react-modal";
import CircularProgress from '@material-ui/core/CircularProgress';
import {FaTimes} from "react-icons/fa";
import "../../css/post.css"
class ModalEditPost extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoading: false,
            emptyPost: false,
            photoPreviewUrl: '',
            newDescription: this.props.post.description
        }
        this.loggedUser = JSON.parse(localStorage.getItem("loggedUser"));
    }
    closeModalEditPost = () => {
        localStorage.setItem("modalEditPostIsOpen", "false")
        window.location.reload()
    };

    handleEditPost = () =>{
        if(this.state.newDescription === "")
            this.setState({emptyPost: true});
        else{
            this.setState({ isLoading: true });
            request('PATCH', `/posts/${this.props.post.id}`, {description: this.state.newDescription} )
                .then(
                    res => {
                        this.closeModalEditPost()
                        window.location.reload()
                    }
                )
                .catch(error => {
                    this.setState({ isLoading: false });
                });
        }
    }

    componentDidUpdate(prevProps, prevState) {
        if (this.state.newDescription !== prevState.newDescription) {
            console.log('newDescription has been updated');
        }
    }

    handleChange = (e) => {
        const { name, value } = e.target;
        this.setState({ [name]: value })
    };

    render() {
        if (this.state.isLoading)
            return (
                <Modal
                    isOpen={localStorage.getItem("modalEditPostIsOpen") === "true"}
                    onRequestClose={this.closeModalEditPost}
                    contentLabel="Edit post"
                    style={{
                        overlay: {
                            backgroundColor: 'rgba(0, 0, 0, 0.5)',
                        },
                        content: {
                            maxWidth: '380px',
                            maxHeight: '330px',
                            margin: 'auto',
                            padding: '20px',
                            boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
                            backgroundColor: '#ffffff',
                            borderRadius: '10px',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                        },
                    }}
                >
                    <div style={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        justifyContent: "center",
                        height: "100vh",
                    }}>
                        <h2>Waiting...</h2>
                        <h3><CircularProgress /></h3>
                        <p>
                            <Button
                                type="button"
                                onClick={this.closeModalEditPost}
                                className="btn-login">
                                Cancel
                            </Button>
                        </p>
                    </div>
                </Modal>
            );
        else
            return (
                <div className="login-container">
                    <Modal
                        isOpen={this.props.isOpen}
                        onRequestClose={this.closeModalEditPost}
                        contentLabel="Edit post"
                        style={{
                            overlay: {
                                backgroundColor: 'rgba(0, 0, 0, 0.5)',
                            },
                            content: {
                                maxWidth: '650px',
                                maxHeight: '380px',
                                margin: 'auto',
                                padding: '10px',
                                boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
                                backgroundColor: '#ffffff',
                                borderRadius: '10px',
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                overflow: 'auto'
                            },
                        }}
                    >
                        <div className="login-container">
                            <form className="post-form">
                                <button
                                    onClick={this.closeModalEditPost}
                                    style={{
                                        position: 'absolute',
                                        right: '20px',
                                        background: 'transparent',
                                        border: 'none',
                                        cursor: 'pointer',
                                        fontSize: '24px',
                                        color: '#333',
                                    }}
                                >
                                    <FaTimes />
                                </button>
                                <h2>Edit Post</h2>
                                <div className="form-group">
                                      <textarea
                                          className="form-control"
                                          placeholder={this.state.newDescription}
                                          style={{ height: '70px', fontFamily: 'Cambria', fontSize: '18px' }}
                                          name="newDescription"
                                          onChange={this.handleChange}
                                      />
                                </div>
                                { this.props.post.photoName !== "" && this.props.post.photoName !== null && (
                                    <div className="form-group actions">
                                        <div style={{ position: 'relative', display: 'inline-block', marginBottom: '10px' }}>
                                            <img src={this.loggedUser.email+'/'+this.props.post.photoName} alt="Preview" style={{ maxWidth: '100%', maxHeight: '200px' }} />
                                        </div>
                                    </div>)
                                }

                                <div className="actions">
                                    <button type="submit" className="btn-login" onClick={this.handleEditPost} disabled={this.state.emptyPost}>Edit post</button>
                                </div>
                            </form>
                        </div>
                    </Modal>
                </div>
            );
    }
}
export default ModalEditPost;
