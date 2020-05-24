import React, { Component } from 'react'
import axios from 'axios';

const apiGetMats = process.env.REACT_APP_API_URL + '/api/mats';
const apiPostMats = process.env.REACT_APP_API_URL + '/api/mats';
const apiDeleteMats = process.env.REACT_APP_API_URL + '/api/mats/';
const apideleteNotes = process.env.REACT_APP_API_URL + '/api/notes/mat/';

// const apiverify = process.env.REACT_APP_API_URL + '/api/users/me';

const headers = {
    'Content-Type': 'application/json',
    'x-access-token': window.localStorage.getItem('token'),
    'Access-Control-Allow-Origin': '*'
}

export default class CreateMat extends Component {

    state = {
        mats: [],
        notes: [],
        auth: window.localStorage.getItem('auth'),
        token: '',
        username: '',
        matname: '',
        redirectLogin: false
    }

    async componentDidMount() {
        this.setState({
            mats: [],
            notes: []
        });
        /* await axios.get(apiverify, {
            headers: headers
        }).then(response => response.data)
        .then((data) => {
            this.setState({ auth: data.auth })
            if (data.user) {
                this.setState({ username: data.user.username })
            }
        }) */
        if ((this.state.auth === false) || (this.state.auth === null)) {
            window.localStorage.removeItem('auth');
            window.localStorage.removeItem('username');
            window.localStorage.removeItem('token');
            window.location.href = '/login';
        } else {
            this.getMats();
            //window.localStorage.setItem('auth', this.state.auth);
            //window.localStorage.setItem('username', this.state.username);
        }
    }

    getMats = async () => {
        const res = await axios.get(apiGetMats, {
            headers: headers
        });
        this.setState({mats: res.data});
    }

    onChangeMatname = (e) => {
        this.setState({
            matname: e.target.value
        })
    }

    onSubmit = async e => {
        e.preventDefault();
        const newMat = {
            matname: this.state.matname
        }
        // eslint-disable-next-line
        if (this.state.matname == '') {
            window.alert('Escriba el nombre de la materia');
        } else {
            await axios.post(apiPostMats, newMat, {
                headers: headers,
            })
        }
        //
        this.getMats();
        this.setState({matname: ''});
    }
    /* 
        async getNotes() {
        const res = await axios.get(apigetNotes);
        if (res.data.map(mat => mat.mat) == this.state.matname) {
            await axios.delete(apideleteNotes, {
                mat: this.state.matname
            })
        }
    }
    */
    deleteMat = async (id, matname) => {
        const check = window.confirm('¿Quieres eliminar la materia?');
        if (check) {
            const check2 = window.confirm('Se eliminarán las tareas relacionadas...');
            if (check2) {
                await axios.delete(apideleteNotes+ matname, {
                    headers: headers
                });
                await axios.delete(apiDeleteMats + id, {
                    headers: headers
                });
                this.getMats();
            }
        }
    }

    render() {
        return (
            <div>
                <form onSubmit={this.onSubmit} className="form"> 
                    <h3>Crea nueva Materia</h3>
                    <main>
                        <input type="text" className="text" onChange={this.onChangeMatname} required/>
                        <label htmlFor="" className="label-name">
                            <span className="content-name">Materia:</span>
                        </label>
                    </main>
                    <button type="submit" className="button">Guardar</button>
                </form>
                <form className="form">
                    <h3>Materias definidas</h3>
                    <ul>
                        {
                        this.state.mats.map(mat => <li className="" key={mat._id} onDoubleClick={() => this.deleteMat(mat._id, mat.matname)}
                        >
                            {mat.matname}
                        </li>)
                        }
                    </ul>
                </form>
            </div>
        )
    }
}
