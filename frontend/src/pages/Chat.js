import React from "react";
import {request} from "../axios/axios";
import MessageBox from "./MessageBox";
import * as SockJS from 'sockjs-client';
import * as Stomp from 'stompjs';
import HeaderClient from "../components/HeaderClient";

class Chat extends React.Component {
    constructor() {
        super();
        const loggedUser = JSON.parse(localStorage.getItem('loggedUser'));
        const clientLogged = localStorage.getItem("clientLogged");
        const idReceiver = clientLogged === "true" ? loggedUser.email : "";

        this.state = {
            messages: [],
            idReceiver: idReceiver,
            idSender: localStorage.getItem("emailSelectedFriend"),
            newMessage: "",
            seenFlagState: false
        };

        this.stompClient = null;
        this.flagSeen = false;
        this.flagTyping = false;
        localStorage.setItem("typing", 'false');
        localStorage.setItem("seen", 'false');
    }

    connect() {
        if(this.stompClient === null) {
            console.log("In Connect");
            const URL = "http://localhost:8080/api/v1/socket/messages";
            const websocket = new SockJS(URL);
            this.stompClient = Stomp.over(websocket);
            this.stompClient.connect({}, frame => {
                localStorage.setItem("seen", 'false')
                this.stompClient.subscribe(`/topic/messages/${this.state.idReceiver}/${this.state.idSender}`, notification => {
                    localStorage.setItem("seen", 'false')
                    let message = notification.body;
                    let parsedMessage = JSON.parse(message);
                    this.flagTyping = false;
                    this.flagSeen = false;
                    if(parsedMessage.message === "(citit)" && this.flagSeen) {
                        return;
                    } else if(parsedMessage.message === "(citit)")
                    {
                        this.flagSeen = true;
                        this.state.flagSeenState = true
                        this.setState({seenFlagState: true})
                    }

                    if(parsedMessage.message === "(typing...)" && this.flagTyping) {
                        return;
                    }  else if(parsedMessage.message === "(typing...)") {
                        this.flagTyping = true;
                        this.flagSeen = true;
                        localStorage.setItem("typing", 'true')
                    }
                    this.state.messages.push(parsedMessage);
                    this.forceUpdate();
                })

                const response = {
                    idSender: this.state.idReceiver,
                    idReceiver: this.state.idSender, // Update with the appropriate receiver
                    message: "(citit)",
                    timestamp: new Date()
                };

                // Convert the message object to a JSON string
                const messageString = JSON.stringify(response);

                // Replace "/sendMessage" with the appropriate endpoint on your server
                this.stompClient.send(`/topic/messages/${this.state.idSender}/${this.state.idReceiver}`, {}, messageString);
            })
        }
    }

    componentDidMount() {
        this.connect()
        this.fetchMessages();
    }
    componentDidUpdate(prevProps, prevState, snapshot) {
        if (this.state.seenFlagState !== prevState.seenFlagState) {
        }
    }

    fetchMessages = () => {
        request("GET", `/message/getMessages/${this.state.idSender}/${this.state.idReceiver}`)
            .then((res) => {
                const val = res.data;
                this.setState({
                    messages: val,
                });
            })
            .catch((error) => {
                console.log(error);
            });
    };

    handleSendMessage = (newMessage) => {
        // Perform API call to send the message
        request("POST", "/message/sendMessage",
            {
                idReceiver: this.state.idSender,
                idSender: this.state.idReceiver,
                message: newMessage
            })
            .then((res) => {
                console.log("Message sent successfully:", res.data);
                // Fetch messages again to update the list
                this.flagSeen = false;
                this.flagTyping = false;
                this.fetchMessages();
            })
            .catch((error) => {
                console.error("Error sending message:", error);
            });
    };

    handleSeen = () => {

        const response1 = {
            idSender: this.state.idReceiver,
            idReceiver: this.state.idSender, // Update with the appropriate receiver
            message: "(citit)"
        };

        // Convert the message object to a JSON string
        const messageString = JSON.stringify(response1);

        // Replace "/sendMessage" with the appropriate endpoint on your server
        this.stompClient.send(`/topic/messages/${this.state.idSender}/${this.state.idReceiver}`, {}, messageString);
    }

    handleWriting = () => {
        console.log("In handleWriting");

        if(this.stompClient !== null) {
            const response = {
                idSender: this.state.idReceiver,
                idReceiver: this.state.idSender,
                message: "(typing...)"
            };

            // Convert the message object to a JSON string
            const messageString = JSON.stringify(response);

            // Replace "/sendMessage" with the appropriate endpoint on your server
            this.stompClient.send(`/topic/messages/${this.state.idSender}/${this.state.idReceiver}`, {}, messageString);
        }
    }
    profilePictureName = localStorage.getItem('profilePictureNameSelectedFriend');

    render() {
        if(localStorage.getItem("clientLogged") === "false") {
            console.log(localStorage.getItem("clientLogged") === "false")

            window.location.replace("http://localhost:3000/")
        }
        else {
            return (
                <React.Fragment>
                    <HeaderClient/>
                    <div style={{
                        maxWidth: '600px',
                        margin: 'auto',
                        padding: '20px',
                        marginTop: '80px',
                        marginBottom: '100px',
                        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
                        backgroundColor: '#f9f9f9',
                        borderRadius: '10px',
                        backgroundSize: 'cover',
                        backgroundRepeat: 'no-repeat',
                        backgroundPosition: 'center'
                    }}>
                        <div style={{
                            textAlign: 'center',
                            marginBottom: '20px',
                            display: 'flex',
                            justifyContent: 'center', // Align items horizontally
                            alignItems: 'center' // Align items vertically
                        }}>
                            <img className='notif-profile-picture'
                                 src={this.profilePictureName !== 'null' ? `${this.state.idSender}/${this.profilePictureName}` : 'profile.png'}
                                 alt='ProfilePictureChat'
                            />
                            <h2 style={{color: '#333', fontSize: '24px', fontWeight: 'bold', marginLeft: '10px'}}>
                                {localStorage.getItem('nameSelectedFriend')}
                            </h2>
                        </div>
                        <MessageBox
                            onSeen={this.handleSeen}
                            onWriting={this.handleWriting}
                            onSendMessage={this.handleSendMessage}
                            receivedMessages={this.state.messages}
                        />
                    </div>
                </React.Fragment>
            );
        }
    }
}

export default Chat;
