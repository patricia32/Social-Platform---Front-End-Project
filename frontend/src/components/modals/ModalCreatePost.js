import React, { Component } from 'react';

import {request} from "../../axios/axios";
import {Button} from "reactstrap";
import Modal from "react-modal";
import CircularProgress from '@material-ui/core/CircularProgress';
import {FaCamera, FaTimes} from "react-icons/fa";
import "../../css/post.css"
class ModalCreatePost extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoading: false,
            duplicatedPhoto: false,
            emptyPost: false,
            photoSaved: 0, // 0 - no op 1 - storing 2 done
            selectedPhoto: null,
            photoPreviewUrl: '',
            createPostDto: {
                idUser: JSON.parse(localStorage.getItem("loggedUser")).email,
                description: "",
                photoName: ""
            }
        }
        this.fileInputRef = React.createRef();
        this.loggedUser = JSON.parse(localStorage.getItem("loggedUser"));
    }

    closeModalCreatePost = () => {
        localStorage.setItem("modalCreatePostIsOpen", "false")
        window.location.reload()
    };

    handleAddPhotoClick = () => {
        this.fileInputRef.current.click();
    };

    createPost = () =>{
        if(this.state.createPostDto.photoName === "" && this.state.createPostDto.description === "")
            this.setState({ emptyPost: true });
        else{
            this.setState({ isLoading: true });
            request('POST', '/posts', this.state.createPostDto)
                .then(
                    res => {
                        const file = this.state.selectedPhoto
                        if(file){
                            this.setState({ photoSaved: 1 });
                            this.uploadPhotoPythonScript(file)
                        }

                        if(this.state.photoSaved === 2 || this.state.photoSaved === 0){
                            this.closeModalCreatePost()
                            this.setState({ isLoading: false });
                            this.setState({photoSaved: 0})
                        }
                    }
                )
                .catch(error => {
                    console.log(error)
                    this.setState({ duplicatedPhoto: true, isLoading: false });
                });
        }
    }
    uploadPhotoPythonScript = (file) => {
        if (file) {
            const formData = new FormData();
            formData.append('photo', file);
            formData.append('userEmail', this.loggedUser.email)

            fetch('http://localhost:5000/upload-photo', {
                method: 'POST',
                body: formData,
            })
            .then(response => {
                if (response.ok)
                    return response.text();
            })
            .then(data => {
                console.log('Photo uploaded successfully!' + data);
                this.setState({ photoSaved: 2 });
                this.closeModalCreatePost()
                window.location.reload()
            })
            .catch(error => {
                console.error('Error:', error);
            });
        }
    }

    handleFileChange = (event) => {
        this.setState({ photoSaved: 1 })
        const file = event.target.files[0];
        const photoPreviewUrl = URL.createObjectURL(file);
        const createPostDto = { ...this.state.createPostDto };
        createPostDto.photoName = file.name;

        this.setState({
            selectedPhoto: file,
            createPostDto,
            photoPreviewUrl,
            emptyPost: false
        });
    };

    componentDidUpdate(prevProps, prevState) {
        if (this.state.selectedPhoto !== prevState.selectedPhoto) {
            console.log('selectedPhoto has been updated');
        }
        if (this.state.createPostDto !== prevState.createPostDto) {
            console.log('createPostDto has been updated');
        }
        if (this.state.photoSaved !== prevState.photoSaved) {
            console.log('photoSaved has been updated');
        }
    }
    handleRemovePhoto = () => {
        const createPostDto = { ...this.state.createPostDto };
        createPostDto.photoName = "";
        this.setState({
            photoPreviewUrl: null,
            createPostDto
        });
        this.fileInputRef.current.value = null;
    };

    handleChange = (e) => {
        const { name, value } = e.target;
        if(name === 'description'){
            const createPostDto = { ...this.state.createPostDto };
            createPostDto.description = value;
            if(createPostDto.photoName !== "")
                this.setState({ photoSaved: 1 })
            this.setState({ createPostDto });
            if(value !== "")
                this.setState({ emptyPost: false });
        }
        else{
            this.setState({ [name]: value })
        }
    };

    modifyPost = () => {
        this.setState({ duplicatedPhoto: false });
    }
    render() {
        if (this.state.isLoading)
            return (
                <Modal
                    isOpen={localStorage.getItem("modalCreatePostIsOpen") === "true"}
                    onRequestClose={this.closeModalCreatePost}
                    contentLabel="Create a post"
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
                                onClick={this.closeModalCreatePost}
                                className="btn-login">
                                Cancel
                            </Button>
                        </p>
                    </div>
                </Modal>
            );
        else
        if (this.state.duplicatedPhoto)
            return (
                <Modal
                    isOpen={localStorage.getItem("modalCreatePostIsOpen") === "true"}
                    onRequestClose={this.closeModalCreatePost}
                    contentLabel="Create a post"
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
                        <button
                            onClick={this.closeModalCreatePost}
                            style={{
                                position: 'absolute',
                                right: '20px',
                                top: '20px',
                                background: 'transparent',
                                border: 'none',
                                cursor: 'pointer',
                                fontSize: '24px',
                                color: '#333',
                            }}
                        >
                            <FaTimes />
                        </button>
                        <h2>You have posted this photo once before</h2>
                        <p>
                            <Button
                                type="button"
                                onClick={this.modifyPost}
                                className="btn-login">
                                Change photo
                            </Button>
                        </p>
                    </div>
                </Modal>
            );
        else
            return (
                <div className="login-container">
                    <Modal
                        isOpen={localStorage.getItem("modalCreatePostIsOpen") === "true"}
                        onRequestClose={this.closeModalCreatePost}
                        contentLabel="Create a post"
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
                                    onClick={this.closeModalCreatePost}
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
                                <h2>New Post</h2>
                                <div className="form-group">
                                      <textarea
                                          className="form-control"
                                          placeholder="What's on your mind?"
                                          style={{ height: '120px', fontFamily: 'Cambria', fontSize: '18px' }}
                                          name="description"
                                          onChange={this.handleChange}
                                      />
                                </div>
                                <div className="form-group actions">
                                    <div>
                                        <button type="button" className="btn-icon" onClick={this.handleAddPhotoClick}>
                                            <FaCamera />
                                            <span>Add Photo</span>
                                        </button>
                                        <input
                                            type="file"
                                            style={{ display: 'none' }}
                                            ref={this.fileInputRef}
                                            onChange={this.handleFileChange}
                                            accept="image/*"
                                            multiple
                                        />
                                        {this.state.photoPreviewUrl && (
                                            <div style={{ position: 'relative', display: 'inline-block', marginBottom: '10px' }}>
                                                <img src={this.state.photoPreviewUrl} alt="Preview" style={{ maxWidth: '100%', maxHeight: '200px' }} />
                                                <button type="button" className="btn-remove" onClick={this.handleRemovePhoto}  style={{
                                                    position: 'absolute',
                                                    top: '10px',
                                                    right: '10px',
                                                    cursor: 'pointer',
                                                    background: 'rgba(255, 255, 255, 0.7)',
                                                    border: '1px solid #ccc',
                                                    borderRadius: '50%',
                                                    width: '30px',
                                                    height: '30px',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    color: '#333',
                                                    fontSize: '16px',
                                                    fontWeight: 'bold',
                                                    transition: 'background 0.3s, transform 0.2s',
                                                }}>
                                                    <FaTimes />
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                </div>
                                <div className="actions">
                                    <button type="submit" className="btn-login" onClick={this.createPost} disabled={this.state.emptyPost}>Post</button>
                                </div>
                            </form>
                        </div>
                    </Modal>
                </div>
            );
    }
}
export default ModalCreatePost;
