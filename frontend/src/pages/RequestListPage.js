import React, { Component } from 'react';
import { Button, Container, Table, Modal, ModalHeader, ModalBody, ModalFooter, Input } from 'reactstrap';
import '../css/RegistrationRequest.css';
import HeaderAdmin from "../components/HeaderAdmin";
import SidebarMenuAdmin from "../components/SidebarMenuAdmin";
import {request} from "../axios/axios";


class RequestListPage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            requests: [],
            modal: false,
            selectedEmail: null,
            reason: '',
            search: '',
            successModal: false,
            successMessage: '',
        };
    }

    componentDidMount() {
        this.loadRegisterRequests();
    }

    loadRegisterRequests = () => {
        request('GET', '/authentication/register_requests')
            .then(response => {
                this.setState({ requests: response.data });
            })
            .catch(error => console.error('There has been a problem with your fetch operation:', error));
    };


    toggleModal = () => {
        this.setState(prevState => ({
            modal: !prevState.modal
        }));
    }

    toggleSuccessModal = () => {
        this.setState(prevState => ({
            successModal: !prevState.successModal
        }));
    }

    setSuccessMessage = (message) => {
        this.setState({
            successMessage: message,
            successModal: true
        });
    }


    handleDeny = (email) => {
        this.setState({ selectedEmail: email, modal: true });
    }


    handleDenyReasonSubmit = () => {
        const { selectedEmail, reason } = this.state;
        request('POST', `/register/deny_request/${selectedEmail}`, reason)
            .then(response => {
                this.setSuccessMessage('Request denied successfully.');
                this.loadRegisterRequests();
            })
            .catch(error => {
                console.error('There has been a problem with your denial operation:', error);
            });
        this.setState({
            modal: false,
            selectedEmail: null,
            reason: '',
        });
    }



    handleApprove = (email) => {
        request('PATCH', `/register/approve_request/${email}`)
            .then(response => {
                this.setSuccessMessage('Request approved successfully.');
                this.loadRegisterRequests();
            })
            .catch(error => {
                console.error('There has been a problem with your approval operation:', error);
            });
    }

    updateSearch = (e) => {
        this.setState({ search: e.target.value });
    }

    confirmDenial = () => {
        this.setState(prevState => ({
            requests: prevState.requests.filter(request => request.id !== prevState.selectedRequestId),
            reason: '',
        }));
        this.toggleModal();
    }

    handleChangeReason = (event) => {
        this.setState({ reason: event.target.value });
    }

    render() {
        const { requests, modal, reason,search,selectedRequestId } = this.state;
        const filteredRequests = requests.filter(request => {
            return request.email.toLowerCase().includes(search.toLowerCase());
        });
        const requestList = requests.map(request => {
            return (
                <tr key={request.id}>
                    <td>{request.email}</td>
                    <td>{request.firstName}</td>
                    <td>{request.lastName}</td>
                    <td>{new Date(request.registrationDate).toLocaleDateString()}</td>
                    <td>
                        <Button color="success" onClick={() => this.handleApprove(request.email)}>Approve</Button>{' '}
                        <Button color="danger" onClick={() => this.handleDeny(request.id)}>Deny</Button>
                    </td>
                </tr>
            );
        });

        return (
            <div >            <HeaderAdmin/>
                <SidebarMenuAdmin/>
                <div className="request-list-container">
                    <Modal isOpen={this.state.modal} toggle={this.toggleModal} className="modal-dialog">
                        <div className="modal-container">
                            <ModalHeader toggle={this.toggleModal} className="deny-modal-header">Deny Reason </ModalHeader>
                            <ModalBody>
                                <Input
                                    type="textarea"
                                    value={this.state.reason}
                                    onChange={this.handleChangeReason}
                                    placeholder="Please provide a reason for denial"
                                />
                            </ModalBody>
                            <ModalFooter>
                                <Button className="modal-button button-cancel" onClick={this.toggleModal}>
                                    Cancel
                                </Button>
                                <Button className="modal-button button-submit" onClick={this.handleDenyReasonSubmit}>
                                    Submit
                                </Button>
                            </ModalFooter>
                        </div>
                    </Modal>
                    <Modal isOpen={this.state.successModal} toggle={this.toggleSuccessModal} className="modal-dialog">
                        <div className="modal-container">
                            <ModalHeader toggle={this.toggleSuccessModal} className="deny-modal-header">Success</ModalHeader>
                            <ModalBody>
                                {this.state.successMessage}
                            </ModalBody>
                            <ModalFooter>
                                <p></p>
                                <Button className="modal-button button-cancel" onClick={this.toggleSuccessModal}>
                                    OK
                                </Button>
                            </ModalFooter>
                        </div>

                    </Modal>
                    <div className="request-list-header">
                        <h1>Request list</h1>
                        <div className="search-bar">
                            <Input
                                type="search"
                                value={search}
                                onChange={this.updateSearch}
                                placeholder="Search requests"
                            />
                        </div>
                    </div>
                    <Table bordered hover className="request-list-table">
                        <thead>
                        <tr>
                            <th width="25%">Email</th>
                            <th width="25%">First Name</th>
                            <th width="25%">Last Name</th>
                            <th width="30%">Registration Date</th>
                            <th width="40%" className="request-list-actions">Actions</th>
                        </tr>
                        </thead>
                        <tbody>
                        {filteredRequests.map(request => (
                            <tr key={request.id}>
                                <td>{request.email}</td>
                                <td>{request.firstName}</td>
                                <td>{request.lastName}</td>
                                <td>{new Date(request.registrationDate).toLocaleDateString()}</td>
                                <td className="actions-cell">
                                    <Button className="button-approve" onClick={() => this.handleApprove(request.email)}>Approve</Button>
                                    <Button className="button-deny" onClick={() => this.handleDeny(request.email)}>Deny</Button>
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </Table>

                </div>
            </div>


        );
    }

}

export default RequestListPage;
