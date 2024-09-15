import React, { Component } from "react";
import '../css/RegistrationRequest.css';


class HeaderAdmin extends Component {
    handleLogOut = () => {
        localStorage.clear();
        window.location.replace("http://localhost:3000/");

    };
    render() {
        return (
            <div>
                <header className="App-header">
                    <div className="App-header-left">
                        <p className="TitleStyle">Social Platform || Admin Page</p>

                    </div>
                    <div className="App-header-right">
                        <button className="LogOutButton"  onClick={this.handleLogOut}>Log out</button>
                    </div>
                </header>
            </div>
        );
    }
}

export default HeaderAdmin;
