import React, { Component } from 'react'
import axios from 'axios'
//import { Redirect } from 'react-router-dom'

const apiSignUp = process.env.REACT_APP_API_URL + '/api/users/signup';

const headers = {
    'Access-Control-Allow-Origin': '*'
}

export default class RegisterUser extends Component {
    state = {
        name: '',
        email: '',
        pass: '',
        cpass: '',
        warning: '',
        redirect: false,
        token: '',
        auth: false,
        accept: ''
    }

    onInputChange = e => {
        this.setState({
            [e.target.name]: e.target.value
        })
    }

    onSubmit = async e => {
        e.preventDefault();
        let newUser = {
            username: this.state.name,
            email: this.state.email,
            password: this.state.pass,
            cpass: this.state.cpass
        }
        if (!this.state.accept) {
            this.setState({
                warning: 'No aceptaste los términos'
            })
        }   else {
            if (newUser.password !== newUser.cpass) {
                this.setState({ 
                    warning: 'Contraseña no coincide'
                })
            } else {
                if (newUser.password.length < 8) {
                    this.setState ({
                        warning: 'Contraseña tiene que tener 8 caracteres como mínimo'
                    })
                } else {
                    await axios.post(apiSignUp, newUser, {
                        headers: headers
                    }).then(response => response.data)
                    .then((data) => {
                        this.setState({ auth: data.auth, warning: data.message, token: data.token })
                        //console.log(data)
                    })
                    if (!this.state.auth) {
                        this.setState ({
                            warning: 'Usuario ya existe'
                        })
                    } else {
                        localStorage.setItem('auth', this.state.auth);
                        localStorage.setItem('token', this.state.token);
                        //console.log(localStorage.getItem('token'));
                        //console.log(localStorage.getItem('auth'));
                        window.location="/";
                        
                        //this.setState({
                        //    redirect: true
                        //})
                    }
                }
            }
        }
    }

    render() {
        //if (this.state.redirect) {
        //    return <Redirect to='/' />
        //}
        return (
            <form onSubmit={this.onSubmit} className="form">
                <h2 className="black">Registrar Usuario</h2>
                {/* SELECT USER */}
                <span>{this.state.warning}</span>
                <main>
                    <input type="text" className="text" name="name" onChange={this.onInputChange} required/>
                    <label htmlFor="name" className="label-name">
                        <span className="content-name">Nombre</span>
                    </label>
                </main>
                <main>
                    <input type="text" className="text" name="email" onChange={this.onInputChange} required/>
                    <label htmlFor="email" className="label-name">
                        <span className="content-name">Email</span>
                    </label>
                </main>
                <main>
                    <input type="password" className="text" name="pass" onChange={this.onInputChange} required/>
                    <label htmlFor="pass" className="label-name">
                        <span className="content-name">Contraseña</span>
                    </label>
                </main>
                <main>
                    <input type="password" className="text" name="cpass" onChange={this.onInputChange} required/>
                    <label htmlFor="cpass" className="label-name">
                        <span className="content-name">Confirmar contraseña</span>
                    </label>
                </main>
                <main className="check">
                    <input type="checkbox" className="checkbox" name="accept" id="accept" onChange={this.onInputChange}/>
                    <label htmlFor="accept">
                        <span>Acepto los términos y condiciones</span>
                    </label>
                </main>
                <button type="submit" className="button buttoncreate">
                    Registrar
                </button>
            </form>
        )
    }
}
