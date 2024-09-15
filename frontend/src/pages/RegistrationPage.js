import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import '../css/LoginAndRegister.css';
import {request} from "../axios/axios";
import CircularProgress from "@material-ui/core/CircularProgress";

class RegistrationPage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            email: '',
            firstName: '',
            lastName: '',
            password: '',
            birthDate: '',
            formErrors: {
                email: '',
                firstName: '',
                lastName: '',
                password: '',
                birthDate: '',
            },
            formValid: false,
            isLoading: false,
            requestDone: false
        };
    }

    handleChange = (e) => {
        const { name, value } = e.target;
        this.setState({ [name]: value }, () => {
            this.validateField(name, value);
        });
    };

    validateField(fieldName, value) {
        let fieldValidationErrors = this.state.formErrors;
        let emailValid = this.state.emailValid;
        let passwordValid = this.state.passwordValid;
        let firstNameValid = this.state.firstNameValid;
        let lastNameValid = this.state.lastNameValid;
        let birthdateValid = this.state.birthdateValid;

        switch (fieldName) {
            case 'email':
                emailValid = value.match(/^([\w.%+-]+)@([\w-]+\.)+([\w]{2,})$/i);
                fieldValidationErrors.email = emailValid ? '' : 'Invalid email address';
                break;
            case 'password':
                passwordValid = value.length >= 8;
                fieldValidationErrors.password = passwordValid ? '' : 'Password must be at least 8 characters long';
                break;
            case 'firstName':
                firstNameValid = /^[a-zA-Z]*$/.test(value);
                fieldValidationErrors.firstName = firstNameValid ? '' : 'First name should not contain digits or special characters';
                break;
            case 'lastName':
                lastNameValid = /^[a-zA-Z]*$/.test(value);
                fieldValidationErrors.lastName = lastNameValid ? '' : 'Last name should not contain digits or special characters';
                break;
            case 'birthdate':
                break;
            default:
                break;
        }

        this.setState({
            formErrors: fieldValidationErrors,
            emailValid: emailValid,
            passwordValid: passwordValid,
            firstNameValid: firstNameValid,
            lastNameValid: lastNameValid,
            birthdateValid: birthdateValid
        }, this.validateForm);
    }

    validateForm() {
        this.setState({
            formValid: Object.values(this.state.formErrors).every((error) => error === ''),
        });
    }

    handleSubmit = (e) => {
        e.preventDefault();
        if (this.state.formValid) {
            let credentials = {
                email: this.state.email,
                password: this.state.password,
                firstName: this.state.firstName,
                lastName: this.state.lastName,
                birthDate: this.state.birthDate
            }
            this.setState({ isLoading: true });
            request('POST', '/authentication/register', credentials)
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
                        fieldValidationErrors.email = 'This email is already used';
                        this.setState(
                            {
                                formErrors: fieldValidationErrors
                            },
                            this.validateForm
                        );
                    }
                })
        }
    }

    render() {
        const { formErrors } = this.state;
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
            if(this.state.requestDone)
                return (
                    <div className="login-container">
                        <div className="message-form">
                                <div style={{
                                    display: "flex",
                                    flexDirection: "column",
                                    alignItems: "center",
                                    justifyContent: "center",
                                }}>
                                    <h2>Thank you!</h2>
                                    <h3>Your account has to be approved by an administrator. You will be notified by email with our response.</h3>
                                    <Link to="/">Login</Link>

                                </div>
                        </div>
                    </div>
                );
            else
                return (
                    <div className="login-container">
                        <form className="login-form" onSubmit={this.handleSubmit}>
                            <h2>Sign Up</h2>
                            <div className="form-group">
                                <label htmlFor="email">Email</label>
                                <input
                                    className={`form-control ${formErrors.email ? 'error' : ''}`}
                                    type="email"
                                    name="email"
                                    id="email"
                                    value={this.state.email}
                                    onChange={this.handleChange}
                                    placeholder="Email"
                                    required
                                />
                                {formErrors.email && <span className="error-message">{formErrors.email}</span>}
                            </div>
                            <div className="form-group">
                                <label htmlFor="firstName">First Name</label>
                                <input
                                    className={`form-control ${formErrors.firstName ? 'error' : ''}`}
                                    type="text"
                                    name="firstName"
                                    id="firstName"
                                    value={this.state.firstName}
                                    onChange={this.handleChange}
                                    placeholder="First Name"
                                    required
                                />
                                {formErrors.firstName && <span className="error-message">{formErrors.firstName}</span>}
                            </div>
                            <div className="form-group">
                                <label htmlFor="lastName">Last Name</label>
                                <input
                                    className={`form-control ${formErrors.lastName ? 'error' : ''}`}
                                    type="text"
                                    name="lastName"
                                    id="lastName"
                                    value={this.state.lastName}
                                    onChange={this.handleChange}
                                    placeholder="Last Name"
                                    required
                                />
                                {formErrors.lastName && <span className="error-message">{formErrors.lastName}</span>}
                            </div>
                            <div className="form-group">
                                <label htmlFor="password">Password</label>
                                <input
                                    className={`form-control ${formErrors.password ? 'error' : ''}`}
                                    type="password"
                                    name="password"
                                    id="password"
                                    value={this.state.password}
                                    onChange={this.handleChange}
                                    placeholder="Password"
                                    required
                                />
                                {formErrors.password && <span className="error-message">{formErrors.password}</span>}
                            </div>
                            <div className="form-group">
                                <label htmlFor="birthDate">Birth Date</label>
                                <input
                                    className={`form-control ${formErrors.birthDate ? 'error' : ''}`}
                                    type="date"
                                    name="birthDate"
                                    id="birthDate"
                                    value={this.state.birthDate}
                                    onChange={this.handleChange}
                                    placeholder="Birth Date"
                                    required
                                />
                                {formErrors.birthDate && <span className="error-message">{formErrors.birthDate}</span>}
                            </div>
                            <button type="submit" className="btn-login" disabled={!this.state.formValid}>
                                Sign Up
                            </button>
                            <div className="already-account">
                                Already have an account? <Link to="/">Login</Link>
                            </div>
                        </form>
                    </div>
        );
    }
}

export default RegistrationPage;
