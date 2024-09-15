import React, { Component } from "react";
import '../css/ProfilePage.css';
class HeaderProfilePage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            activeTab: 'about'
        };
    }

    componentDidMount() {
        if (window.location.pathname.includes('/profile-photo')) {
            this.setState({ activeTab: 'photos' });
        }
        if (window.location.pathname.includes('/profile-about')) {
            this.setState({ activeTab: 'about' });
        }
        if (window.location.pathname.includes('/albums-page')) {
            this.setState({ activeTab: 'albums' });
        }
    }
    setActiveTab = (newActiveTab) => {
        this.setState({ activeTab: newActiveTab });
        if(newActiveTab==='photos'){
            window.location.replace("http://localhost:3000/profile-photo")
        }
        if(newActiveTab==='about'){
            window.location.replace("http://localhost:3000/profile-about")
        }
        if(newActiveTab==='albums'){
            window.location.replace("http://localhost:3000/albums-page")
            window.location.replace("http://localhost:3000/albums-page")
        }
    };

    render() {
        const { activeTab } = this.state;

        return (
            <header className="App-header-profile">
                <button
                    className={activeTab === 'about' ? 'active' : ''}
                    onClick={() => this.setActiveTab('about')}>
                    About
                </button>
                <button
                    className={activeTab === 'photos' ? 'active' : ''}
                    onClick={() => this.setActiveTab('photos')}>
                    Photos
                </button>
                <button
                    className={activeTab === 'albums' ? 'active' : ''}
                    onClick={() => this.setActiveTab('albums')}>
                    Albums
                </button>
            </header>
        );
    }
}

export default HeaderProfilePage;
