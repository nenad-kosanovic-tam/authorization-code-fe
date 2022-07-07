import React from 'react';
import axios from "axios";
import ReactJson from "react-json-view";

export class Login extends React.Component {

    constructor(props) {
        super(props);
        this.state = {token: "", users: ""}
    }

    parseJwt(token) {
        let base64Url = token.split('.')[1];
        let base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        let jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function (c) {
            return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        }).join(''));

        return jsonPayload;
    }

    getUsers(token) {
        const headers = {
            'Content-Type': 'application/json',
            'Authorization': 'bearer ' + token
        };

        axios.get('https://127.0.0.1:8443/resources/users',
            {headers})
            .then(response => this.setState({users: JSON.stringify(response)}))
    }

    getToken(code) {
        const headers = {
            'Content-Type': 'application/json',
            'Authorization': 'Basic Y2QyOmNkMg=='
        };

        axios.post('https://127.0.0.1:8443/oauth/token?client_id=cd2&grant_type=authorization_code&redirect_uri=http://127.0.0.1:8080/login&code=' + code,
            {}, {headers})
            .then(response => this.setState({token: JSON.stringify(response)}))
    }

    getCode() {
        window.location.href = "https://localhost:8443/oauth/authorize?scope=webapp&client_id=cd2&response_type=code&redirect_uri=http://127.0.0.1:8080/login";
    }

    render() {

        return (
            <div>
                <h1>Login code: {this.props.code}</h1>
                <button
                    onClick={() => this.getCode()}>
                    Refresh Code
                </button>
                <button onClick={() => this.getToken(this.props.code)}> Get token</button>
                {this.state.token ?
                    <button onClick={() => this.getUsers(JSON.parse(this.state.token).data.access_token)}> Get auth
                        users</button> : null}

                <h1>Users:</h1>
                {this.state.users ? <ReactJson src={JSON.parse(this.state.users)} theme="monokai"/> : null}

                <h1>Response:</h1>
                {this.state.token ? <ReactJson src={JSON.parse(this.state.token)} theme="monokai"/> : null}

                <h1>Token Data: </h1>
                {this.state.token ?
                    <ReactJson src={JSON.parse(this.parseJwt(JSON.parse(this.state.token).data.access_token))}
                               theme="monokai"/> : null}

            </div>
        )
    }
}