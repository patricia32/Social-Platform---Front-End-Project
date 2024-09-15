import React, { Component } from 'react';

class EditProfileModal extends Component {
    constructor(props) {
        super(props);
        this.state = { formState: { ...props.userData } };

        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    componentDidUpdate(prevProps) {
        if (this.props.userData !== prevProps.userData) {
            this.setState({ formState: { ...this.props.userData } });
        }
    }

    handleChange(e) {
        const { name, value } = e.target;
        this.setState(prevState => {
            const updatedState = { ...prevState.formState, [name]: value };
            console.log('Updated State:', updatedState);
            return { formState: updatedState };
        });
    }


    handleSubmit(e) {
        e.preventDefault();
        this.props.onSave(this.state.formState);
        this.props.onClose();
    }

    render() {
        const { isOpen, onClose } = this.props;
        const { formState } = this.state;

        if (!isOpen) return null;

        return (
            <div className="modal-overlay">
                <div className="modal-content">
                    <button className="modal-close-button" onClick={onClose}>X</button>
                    <h2>Edit Profile</h2>
                    <form onSubmit={this.handleSubmit}>
                        <div>
                            <label>Bio:</label>
                            <textarea name="bio" value={formState.bio || ''} onChange={this.handleChange} />
                        </div>
                        <div>
                            <label>Education:</label>
                            <input type="text" name="study" value={formState.study || ''} onChange={this.handleChange} />
                        </div>
                        <div>
                            <label>From:</label>
                            <input type="text" name="home" value={formState.home || ''} onChange={this.handleChange} />
                        </div>
                        <div>
                            <label>Work:</label>
                            <input type="text" name="work" value={formState.work|| ''} onChange={this.handleChange} />
                        </div>
                        <div>
                            <label>Birthplace:</label>
                            <input type="text" name="birthplace" value={formState.birthplace || ''} onChange={this.handleChange} />
                        </div>

                        <button type="submit" className="modal-save-button">Save Changes</button>
                    </form>
                </div>
            </div>
        );
    }
}

export default EditProfileModal;
