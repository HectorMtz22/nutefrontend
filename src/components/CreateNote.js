import React, { Component } from 'react'
import axios from 'axios'
import DatePicker from 'react-datepicker'
import { Redirect } from 'react-router-dom'
import 'react-datepicker/dist/react-datepicker.css'

const apiMats = process.env.REACT_APP_API_URL + '/api/mats';
const apiCreateNote = process.env.REACT_APP_API_URL + '/api/notes';
const apiPutNotes = process.env.REACT_APP_API_URL + '/api/notes/';

const apiverify = process.env.REACT_APP_API_URL + '/api/users/me';

const headers = {
    'Content-Type': 'application/json',
    'x-access-token': window.localStorage.getItem('token'),
    'Access-Control-Allow-Origin': '*'
}

export default class CreateNote extends Component {

    state= {
        mats: [],
        matSelected: '',
        title: '',
        titlewarning: '',
        content: '',
        date: new Date(),
        editing: false,
        _id: '',
        redirect: false,
        redirectmat: false,
        redirectLogin: false,
        auth: '',
        token: '',
        username: ''
    }

    async componentDidMount() {
        const datePicker=document.getElementsByClassName("react-datepicker__input-container")[0];
        datePicker.childNodes[0].setAttribute("readOnly",true);
        await axios.get(apiverify, {
            headers: headers
        }).then(response => response.data)
        .then((data) => {
            this.setState({ auth: data.auth })
            if (data.user) {
                this.setState({ username: data.user.username })
            }
        })
        if (!this.state.auth) {
            window.localStorage.removeItem('auth');
            window.localStorage.removeItem('username');
            window.localStorage.removeItem('token');
            window.location.href = '/login';
        } else {
            //window.localStorage.setItem('auth', this.state.auth);
            //window.localStorage.setItem('username', this.state.username);
            const res = await axios.get(apiMats, {
                headers: headers
            });
            if (res.data[0]) {
                this.setState({
                    matSelected: ''
                })
            } else {
                alert("Para continuar, ingresa una materia");
                this.setState({redirectmat: true});
                //window.location.href = "/mat";
            }
            this.setState({
                mats: res.data.map(mat => mat.matname),
            })
            if (this.props.match.params) {
                const res = await axios.get(apiPutNotes + this.props.match.params.id, {
                    headers: headers
                });
                //console.log(res.data)
                this.setState({
                    title: res.data.title,
                    content: res.data.content,
                    date: new Date(res.data.date),
                    matSelected: res.data.mat,
                    editing: true,
                    _id: this.props.match.params.id
                })
            }
        }
    }

    onSubmit = async (e) => {
        e.preventDefault();
        const newNote = {
            title: this.state.title,
            content: this.state.content,
            date: this.state.date,
            mat: this.state.matSelected
        };
        if (this.state.editing) {
            await axios.put(apiPutNotes + this.state._id, newNote);
            //window.location.href="/";
        } else {
            await axios.post(apiCreateNote, newNote, {
                headers: headers
            });
        }
        this.setState({redirect: true});
        //window.location.href = '/';
       }

    onInputChange = e => {
        this.setState({
            [e.target.name]: e.target.value
        });
        if (e.target.name === 'title') {
            if (e.target.value.length >= 17) {
                this.setState({
                    titlewarning: 'Recomendamos que no esté tan largo'
                });
            }
            if (e.target.value.length < 17) {
                this.setState({
                    titlewarning: ''
                });
            }
        }
    }

    onChangeDate = date => {
        this.setState({date});
    }

    render() {
        if (this.state.redirect) {
            return <Redirect to='/'/>;
        }
        if (this.state.redirectmat) {
            return <Redirect to='/mat' />;
        }
        return (
            <form onSubmit={this.onSubmit} className="form">
                <h3 className="black">Crea una nota</h3>
                {/* SELECT USER */}
                <main>
                <select className="text" name="matSelected" onChange={this.onInputChange} value={this.state.matSelected}>
                    <option>(Selecciona una materia)</option>
                    {
                        this.state.mats.map(mat =>
                            <option key={mat} value={mat}>
                                {mat}
                            </option>)
                    }
                </select>
                <label htmlFor="title" className="label-name:valid">
                        <span className="content-name:valid">Materia</span>
                    </label>
                </main>
                <main>
                    <input type="text" className="text" name="title" required onChange={this.onInputChange} value={this.state.title}/>
                    <label htmlFor="title" className="label-name">
                        <span className="content-name">Título</span>
                    </label>
                </main>
                <span className="spanwarning">{this.state.titlewarning}</span>
                <main className="textarea">
                    <textarea name="content" className="text" required onChange={this.onInputChange} value={this.state.content}></textarea>
                    <label htmlFor="content" className="label-name">
                        <span className="content-name">Descripción</span>
                    </label>
                </main>
                <h5>Termina en:</h5>
                <main>
                    <DatePicker name="datepicker" selected={this.state.date} onChange={this.onChangeDate} showTimeSelect minDate={new Date()} dateFormat="dd/MM/yyyy h:mm aa" withPortal  />
                    <label htmlFor="datepicker" className="label-name">
                        <span className="content-name:valid">Fecha</span>
                    </label>
                </main>
                <button type="submit" className="button buttoncreate">
                    Guardar Nota
                </button>
            </form>
        )
    }
}
