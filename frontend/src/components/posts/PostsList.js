import React, {Component} from 'react';
import {request} from "../../axios/axios";
import PostBox from "./PostBox";
import CircularProgress from "@material-ui/core/CircularProgress";

class PostsList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoading: false,
            posts: []
        };
        this.loggedUser = JSON.parse(localStorage.getItem('loggedUser'));
        this.getPosts()
    }

    getPosts = () => {
        this.setState({isLoading: true})
        if(localStorage.getItem("currentPage") === "profile-page"){
            request('GET',`/posts/${this.loggedUser.email}`)
                .then(response => {
                    console.log(response.data)
                    const sortedPosts = response.data.sort((a, b) => {
                        return new Date(b.timestamp) - new Date(a.timestamp);
                    });
                    this.setState({posts: sortedPosts})
                    this.setState({isLoading: false})
                })
                .catch(error => console.error('There has been a problem with your operation:', error));
        }
       else{
            request('GET',`/posts/friends/${this.loggedUser.email}`)
                .then(response => {
                    // const sortedPosts = response.data.sort((a, b) => {
                    //     return new Date(b.timestamp) - new Date(a.timestamp);
                    // });
                    console.log(response.data)
                    this.setState({posts: response.data})
                    this.setState({isLoading: false})
                })
                .catch(error => console.error('There has been a problem with your operation:', error));
        }

    }

    componentDidUpdate(prevProps, prevState) {
        if (this.state.posts !== prevState.posts) {}
    }

    render() {
        if(this.state.isLoading)
            return (
                <h3><CircularProgress /></h3>
            )
        else
            return(
                <div>
                    {this.state.posts.map((post, index) => (
                        <PostBox key={index} post={post} />
                    ))}
                </div>
        );
    }
}
export default PostsList;
