import React, { Component } from 'react'
import { Link } from 'react-router-dom';

export default class Footer extends Component {
    render() {
        let mobileFooter = 'mobile-footer';
        let pFooter = '';
        if (!localStorage.getItem('auth')) {
            mobileFooter += ' invisible';
            pFooter += ' visible';
        }
        return (
            <footer>
                <p className={pFooter}>&copy; 2020, todos los derechos reservados</p>
                <main className={mobileFooter}>
                    <Link to="/" className="btnfooter">
                        <img src="img/notewhite.png" alt="Note" className="iconfooter"/>
                        <h2 className="titulo">Notas</h2>
                    </Link>
                    <Link to="/create" className="btnfooter">
                        <img src="img/addnotewhite.png" alt="Create" className="iconfooter"/>
                        <h2 className="titulo">Crear</h2>
                    </Link>
                    <Link to="/mat" className="btnfooter">
                        <img src="img/book.png" alt="Mat" className="iconfooter"/>
                        <h2 className="titulo">Materias</h2>
                    </Link>
                    <Link to="/user" className="btnfooter">
                        <img src="img/user.png" alt="User" className="iconfooter"/>
                        <h2 className="titulo">Usuario</h2>
                    </Link>
                </main>
            </footer>
        )
        
    }
}
