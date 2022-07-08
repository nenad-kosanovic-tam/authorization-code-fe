import React from 'react';
import axios from "axios";
import ReactJson from "react-json-view";

let localEnv = "https://localhost:8443";
let a1Env = "https://dmt.a1.unitycms.io/auth";
let a2Env = "https://dmt.a2.unitycms.io/auth";
let a3Env = "https://dmt.a3.unitycms.io/auth";
let a4Env = "https://dmt.a4.unitycms.io/auth";
let a5Env = "https://dmt.a5.unitycms.io/auth";
let a6Env = "https://dmt.a6.unitycms.io/auth";

const envOptions = [
    {label: 'Local', value: localEnv},
    {label: 'a1', value: a1Env},
    {label: 'a2', value: a2Env},
    {label: 'a3', value: a3Env},
    {label: 'a4', value: a4Env},
    {label: 'a5', value: a5Env},
    {label: 'a6', value: a6Env},
];

export class Login extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            token: "",
            users: "",
            env: localEnv
        }
    }

    componentDidMount() {
        this.setState({env: localStorage.getItem('env') || localEnv})
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

        axios.get(this.state.env + '/resources/users',
            {headers})
            .then(response => this.setState({users: JSON.stringify(response)}))
    }

    getToken(code) {
        const headers = {
            'Content-Type': 'application/json',
            'Authorization': 'Basic Y2QyOmNkMg=='
        };

        axios.post(this.state.env + '/oauth/token?client_id=cd2&grant_type=authorization_code&redirect_uri=http://127.0.0.1:8080/login&code=' + code,
            {}, {headers})
            .then(response => this.setState({token: JSON.stringify(response)}))
    }

    getCode() {
        window.location.href = this.state.env + "/oauth/authorize?scope=webapp&client_id=cd2&response_type=code&redirect_uri=http://127.0.0.1:8080/login";
    }

    handleEnvChange(event) {
        localStorage.setItem('env', event.target.value)
        this.setState({env: event.target.value})
    }

    render() {
        return (

            <div>
                <div>
                    <label>
                        Environment:
                        <select value={this.state.env} onChange={this.handleEnvChange.bind(this)}>
                            {envOptions.map((option) => (
                                <option key={option.label} value={option.value}>{option.label}</option>
                            ))}
                        </select>
                    </label>
                </div>


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