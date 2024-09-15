import React, { Component } from 'react';
import { Link } from "react-router-dom";
import { request, setAuthHeader } from "../axios/axios";
import ModalResetPassword from "../components/modals/ModalResetPassword";
import CircularProgress from "@material-ui/core/CircularProgress";

class LoginPage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            email: '',
            password: '',
            formErrors: {
                email: '',
                password: '',
            },
            formValid: false,
            isLoading: false
        };
        setAuthHeader("");
        localStorage.setItem("clientLogged", "false");
        localStorage.setItem("adminLogged", "false");
        localStorage.setItem("loggedUser", null);
    }

    handleChange = (e) => {
        const { name, value } = e.target;
        this.setState({ [name]: value }, () => {
            this.validateField(name, value);
        });
    };

    handleLogin = () => {
        const credentials = {
            email: this.state.email,
            password: this.state.password
        };
        this.setState({ isLoading: true });
        request('POST', '/authentication/login', credentials)
            .then(
                res => {
                    this.setState({ isLoading: false });
                    const loggedUser = res.data;
                    localStorage.setItem("loggedUser", JSON.stringify(loggedUser));
                    setAuthHeader(loggedUser.token);

                    if (loggedUser.role === "CLIENT") {
                        localStorage.setItem("clientLogged", "true");
                        localStorage.setItem("adminLogged", "false");
                        window.location.replace("http://localhost:3000/profile-about")
                    } else {
                        localStorage.setItem("clientLogged", "false");
                        localStorage.setItem("adminLogged", "true");
                        window.location.replace("http://localhost:3000/request-list")
                    }
                }
            )
            .catch(error => {
                if (error.code === "ERR_BAD_REQUEST") {
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
            });
    };

    openModalResetPassword = () => {
        localStorage.setItem("modalResetPasswordIsOpen", "true")
        window.location.reload()
    };

    validateField(fieldName, value) {
        let fieldValidationErrors = this.state.formErrors;
        let emailValid = this.state.emailValid;
        let passwordValid = this.state.passwordValid;

        switch (fieldName) {
            case 'email':
                emailValid = value.match(/^([\w.%+-]+)@([\w-]+\.)+([\w]{2,})$/i);
                fieldValidationErrors.email = emailValid ? '' : 'Invalid email address';
                break;
            case 'password':
                passwordValid = value.length >= 8;
                fieldValidationErrors.password = passwordValid ? '' : 'Password must be at least 8 characters long';
                break;
            default:
                break;
        }
        this.setState({
            formErrors: fieldValidationErrors,
            emailValid: emailValid,
            passwordValid: passwordValid
        }, this.validateForm);
    }

    validateForm() {
        this.setState({
            formValid: Object.values(this.state.formErrors).every((error) => error === ''),
        });
    }

    render() {
        if(this.state.isLoading)
            return (
                <div className="login-container">
                    <div className="message-form">
                        <div style={{
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                            justifyContent: "center",
                        }}>
                            <h2>Waiting...</h2>
                            <h3><CircularProgress /></h3>
                        </div>
                    </div>
                </div>
            )
        else
        return (
            <div className="login-container">
                <form className="login-form">
                    <h2>Login</h2>
                    <div className="form-group">
                        <input
                            className="form-control"
                            type="text"
                            name="email"
                            value={this.state.email}
                            onChange={this.handleChange}
                            placeholder="Email"
                            required
                        />
                        {this.state.formErrors.email && <span className="error-message">{this.state.formErrors.email}</span>}
                    </div>
                    <div className="form-group">
                        <input
                            className="form-control"
                            type="password"
                            name="password"
                            value={this.state.password}
                            onChange={this.handleChange}
                            placeholder="Password"
                            required
                        />
                        {this.state.formErrors.password && <span className="error-message">{this.state.formErrors.password}</span>}
                    </div>
                    <button type="button" className="btn-login" onClick={this.handleLogin} disabled={!this.state.formValid}>
                        Login
                    </button>
                    <p>
                        <Link to="/register">
                            <button type="button" className="btn-login">
                                Sign up
                            </button>
                        </Link>
                    </p>
                    <div className="already-account">
                        <button type="button" className="btn-login" onClick={this.openModalResetPassword}>
                            Reset password
                        </button>
                    </div>
                </form>
                {<ModalResetPassword/>}
            </div>
        );
    }
}

export default LoginPage;
