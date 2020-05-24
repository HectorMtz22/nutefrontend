import React, { Component } from 'react'
import axios from 'axios'
import { format } from 'timeago.js'
import { Link } from 'react-router-dom'

const apigetNotes = process.env.REACT_APP_API_URL + '/api/notes';
const apideleteNotes = process.env.REACT_APP_API_URL + '/api/notes/';

//const apiverify = process.env.REACT_APP_API_URL + '/api/users/me';

const headers = {
    'Content-Type': 'application/json',
    'x-access-token': window.localStorage.getItem('token'),
    'Access-Control-Allow-Origin': '*'
}

export default class ListNotes extends Component {

    state = {
        notes: [],
        auth: window.localStorage.getItem('auth'),
        token: '',
        username: '',
        redirectLogin: false
    }

    async componentDidMount() {
        /* await axios.get(apiverify, {
            headers: headers
        }).then(response => response.data)
        .then((data) => {
            this.setState({ auth: data.auth })
            if (data.user) {
                this.setState({ username: data.user.username })
            }
            //console.log(data);
        }) */
        //console.log(this.state.auth);
        if ((this.state.auth === false) || (this.state.auth === null)) {
            window.localStorage.removeItem('auth');
            window.localStorage.removeItem('username');
            window.localStorage.removeItem('token');
            window.location.href = '/login';
        } else {
            this.setState({
                loading: true
            })
            this.getNotes();
            //window.localStorage.setItem('auth', this.state.auth);
            //window.localStorage.setItem('username', this.state.username);
        }
    }

    async getNotes() {
        const res = await axios.get(apigetNotes, {
            headers: headers
        });
        this.setState({ 
            notes: res.data,
            loading: false
         });
    }

    deleteNote = async (id) => {
        const check = window.confirm('Quieres checar e eliminar la nota');
        if (check) {
            await axios.delete(apideleteNotes + id, {
                headers: headers
            });
            this.getNotes();
        }
    }

    render() {
        if (this.state.loading) {
            return (
                <main className="loader">
                    <div id="preloader5"></div>
                </main>
            )
        }
        if (!this.state.notes[0]) {
            return (
                <form className="form">
                    <p>¡Comienza a usar la app!</p>
                    <Link to="/create">
                        <button className="button">Crear una nueva nota</button>
                    </Link>
                </form>
            )
        } else {
            return (
                <main className="grid-3">
                    {
                        this.state.notes.map(note => (
                            <section key={note._id}>
                                <div className="block">
                                    <Link to={"/edit/" + note._id}>
                                        <img src="/img/edit-button.png" alt="Edit" className="icon" />
                                    </Link>

                                    <img src="/img/check.png" alt="Check" className="icon check" onClick={() => this.deleteNote(note._id)} />
                                    <h3 className="title">{note.title}</h3>
                                </div>
                                <p className="mat">{note.mat}</p>
                                <p className="content">{note.content}</p>
                                <p className="date">{format(note.date)}</p>
                                { /*
                                        <button className="button none" onClick={() => this.deleteNote(note._id)}>Check</button>
                                    */ }
                            </section>
                        ))
                    }
                </main>
            )
        }
    }
}
