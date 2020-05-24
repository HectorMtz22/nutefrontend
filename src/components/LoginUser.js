import React, { Component } from 'react'
import axios from 'axios'
import { Link } from 'react-router-dom'

const api = process.env.REACT_APP_API_URL;
const apiLogin = api + '/api/users/signin';

const headers = {
    'Content-Type': 'application/json',
    'x-access-token': window.localStorage.getItem('token'),
    'Access-Control-Allow-Origin': '*'
}

export default class LoginUser extends Component {
    state = {
        email: '',
        pass: '',
        auth: window.localStorage.getItem('auth'),
        token: '',
        message: '',
        redirectUser: false
    }

    async componentDidMount() {
        await axios.get(api, {
            headers
        });
    }

    onInputChange = e => {
        this.setState({
            [e.target.name]: e.target.value
        })
    }

    onSubmit = async (e) => {
        e.preventDefault();
        const logUser = {
            email: this.state.email,
            password: this.state.pass
        };
        await axios.post(apiLogin, logUser, {
            headers: headers
        }).then(response => response.data)
        .then((data) => {
            this.setState({ auth: data.auth, token: data.token, message: data.message })
            console.log(data)
        })
        if(this.state.auth) {
            localStorage.setItem('token', this.state.token);
            localStorage.setItem('auth', this.state.auth);
            window.location = "/";
        } else {
            alert(this.state.message);
            window.location = "/login";
        }
        
    }

    render() {
        return (
            <form onSubmit={this.onSubmit} className="form" autoComplete="off">
                <h2 className="black">Inicia Sesión</h2>
                <main>
                    <input type="text" className="text" name="email" onChange={this.onInputChange}  value={this.state.email} autoFocus required/>
                    <label htmlFor="email" className="label-name">
                        <span className="content-name">Email</span>
                    </label>
                </main>
                <main>
                    <input type="password" className="text" name="pass" onChange={this.onInputChange} value={this.state.pass} required/>
                    <label htmlFor="pass" className="label-name">
                        <span className="content-name">Contraseña</span>
                    </label>
                </main>
                <Link to="/register" className="register">
                    <span>No tengo una cuenta</span>
                </Link>
                <button type="submit" className="button">
                    Login
                </button>
            </form>
        )
    }
}
