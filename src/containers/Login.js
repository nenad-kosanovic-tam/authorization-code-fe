import React from 'react';
import axios from "axios";
import ReactJson from "react-json-view";

export class Login extends React.Component {

    constructor(props) {
        super(props);
        this.state = {token: ""}
    }

    parseJwt(token) {
        let base64Url = token.split('.')[1];
        let base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        let jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function (c) {
            return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        }).join(''));

        return jsonPayload;
    }

    getToken(code) {
        const headers = {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
            'Authorization': 'Basic Y2QyOmNkMg==',
            'Access-Control-Allow-Methods': 'GET, OPTIONS, POST',
            'Access-Control-Allow-Credentials': true
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