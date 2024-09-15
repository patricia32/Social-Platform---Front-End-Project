import React, { Component } from 'react';

import {request} from "../../axios/axios";
import {Button} from "reactstrap";
import Modal from "react-modal";
import CircularProgress from '@material-ui/core/CircularProgress';
class ModalResetPassword extends Component {
    constructor(props) {
        super(props);
        this.state = {
            email: '',
            isLoading: false,
            requestDone: false,
            formErrors: {
                email: '',
                password: '',
            },
            formValid: false
        }
    }
    handleEmailChange = (event) => {
        this.setState({ email: event.target.value}, () => {
            console.log(event.target.value)
            this.validateField('email', event.target.value);
        });

    };

    validateField(fieldName, value) {
        let fieldValidationErrors = this.state.formErrors;
        let emailValid = this.state.emailValid;

        console.log(fieldName)
        switch (fieldName) {
            case 'email':
                emailValid = value.match(/^([\w.%+-]+)@([\w-]+\.)+([\w]{2,})$/i);
                fieldValidationErrors.email = emailValid ? '' : 'Invalid email address';
                console.log("mno")
                break;
            default:
                break;
        }
        this.setState({
            formErrors: fieldValidationErrors,
            emailValid: emailValid,
        }, this.validateForm);
    }

    validateForm() {
        this.setState({
            formValid: Object.values(this.state.formErrors).every((error) => error === ''),
        });
    }

    handleResetPassword = () => {
        this.setState({ isLoading: true });
        request('PATCH', `/register/reset_password/${this.state.email}`)
            .then(
                res => {
                    this.setState({ isLoading: false });
                    this.setState({ requestDone: true });
                }
            )
            .catch(error => {
                if(error.code === "ERR_BAD_REQUEST"){
                    this.setState({ isLoading: false });
                    let fieldValidationErrors = this.state.formErrors;
                    fieldValidationErrors.email = 'This account does not exist or it is not validated yet';
                    this.setState(
                        {
                            formErrors: fieldValidationErrors
                        },
                        this.validateForm
                    );
                }
            })
    };

    closeModalResetPassword = () => {
        localStorage.setItem("modalResetPasswordIsOpen", "false")
        window.location.reload()
    };

    render() {
        const {resetEmail} = this.state.email;
        if (this.state.isLoading)
            return (
                <Modal
                    isOpen={localStorage.getItem("modalResetPasswordIsOpen") === "true"}
                    onRequestClose={this.closeModalResetPassword}
                    contentLabel="Reset Password Modal"
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
                        <h3>
                            <CircularProgress />
                        </h3>
                        <p>
                            <Button
                                type="button"
                                onClick={this.closeModalResetPassword}
                                className="btn-login">
                                Cancel
                            </Button>
                        </p>
                    </div>
                </Modal>
            );
        else
            if (this.state.requestDone)
                return(
                <Modal
                    isOpen={localStorage.getItem("modalResetPasswordIsOpen") === "true"}
                    onRequestClose={this.closeModalResetPassword}
                    contentLabel="Reset Password Modal"
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
                        <h2>Password reset request has been successfully processed.</h2>
                        <p>
                            <Button
                                type="button"
                                onClick={this.closeModalResetPassword}
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
                            isOpen={localStorage.getItem("modalResetPasswordIsOpen") === "true"}
                            onRequestClose={this.closeModalResetPassword}
                            contentLabel="Reset Password Modal"
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
                            <h2>Reset Password</h2>
                            <div className="login-form">
                                <div className="form-group">
                                    <input
                                        className="form-control"
                                        type="email"
                                        id="resetEmail"
                                        value={resetEmail}
                                        onChange={this.handleEmailChange}
                                        placeholder="Enter your email"
                                        required
                                    />
                                    {this.state.formErrors.email && <span className="error-message">{this.state.formErrors.email}</span>}
                                </div>
                                    <p>
                                    <Button
                                        type="button"
                                        className="btn-login"
                                        onClick={(e) => this.handleResetPassword(e)}>
                                        Reset Password
                                    </Button>
                                </p>
                                <p>
                                    <Button
                                        type="button"
                                        onClick={this.closeModalResetPassword}
                                        className="btn-login">
                                        Cancel
                                    </Button>
                                </p>
                            </div>
                        </Modal>
                    </div>
                );
        }
}
export default ModalResetPassword;
