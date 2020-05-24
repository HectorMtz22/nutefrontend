import React, { Component } from 'react'
import axios from 'axios'

const apiverify = process.env.REACT_APP_API_URL + '/api/users/me';

const headers = {
    'Content-Type': 'application/json',
    'x-access-token': window.localStorage.getItem('token'),
    'Access-Control-Allow-Origin': '*'
}

export default class User extends Component {
    state = {
        redirectLogin: false,
        username: '',
        email: ''
    }

    async componentDidMount() {
         await axios.get(apiverify, {
            headers: headers
        }).then(response => response.data)
        .then((data) => {
            this.setState({
                username: data.user.username,
                email: data.user.email
            })
        }) 
    }

    onSubmit = e => {
        e.preventDefault();
        window.localStorage.removeItem('token');
        window.localStorage.removeItem('username');
        window.localStorage.removeItem('auth');
        window.location= "/login";
    }
    
    render() {
        return (
            <form onSubmit={this.onSubmit} className="form">
                <h2>Usuario</h2>
                <section>
                    <main>
                        <input type="text" className="text" name="name" value={this.state.username}/>
                        <label htmlFor="name" className="label-name">
                            <span className="content-name">Nombre</span>
                        </label>
                    </main>
                    <main>
                        <input type="text" className="text" name="email" value={this.state.email}/>
                        <label htmlFor="email" className="label-name">
                            <span className="content-name">Email</span>
                        </label>
                    </main>
                </section>
                <button type="submit" className="button">Cerrar Sesión</button>
            </form>
        )
    }
}
