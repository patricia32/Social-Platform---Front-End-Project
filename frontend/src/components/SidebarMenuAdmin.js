import React, { Component } from "react";
import { useNavigate } from "react-router-dom";
import '../css/RegistrationRequest.css';


class SidebarMenuAdmin extends Component {
    render() {
        return (
            <div className="admin-sidemenu">
                <p className="titleMenu">Menu</p>
                <button
                    className="sidebar-button"
                    onClick={() => {
                        this.props.navigate("/request-list");
                    }}>
                    Requests
                </button>
            </div>
        );
    }
}

const SidebarMenuAdminWithNavigate = () => {
    const navigate = useNavigate();

    return <SidebarMenuAdmin navigate={navigate} />;
}

export default SidebarMenuAdminWithNavigate;
