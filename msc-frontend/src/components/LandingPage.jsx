import axios from 'axios';
import React, { Component } from 'react';

const BASE_URL = "http://10.61.38.193:8080";

class LandingPage extends Component {
    state = {
        showPopup: false,
        isValidInput: null,
        loginData : {}
    }

    constructor(props) {
        super(props);
        this.handleLogin = this.handleLogin.bind(this);
        this.throwsAuthenticationError = this.throwsAuthenticationError.bind(this);
        this.successAuthentication = this.successAuthentication.bind(this);
        this.handleShowPopup = this.handleShowPopup.bind(this);
    }

    handleLogin() {
        let inputUserEmail = document.getElementById('login-useremail');
        let inputPassword = document.getElementById('login-password');
        let user = {
            'email': inputUserEmail.value,
            'password': inputPassword.value
        }
        axios({
            method: "post",
            data: user,
            url: `${BASE_URL}/api/v1/user-profiles/auth`
        }).then((res) => {
            console.log(res);
            if(res.data) {
                this.setState({loginData : res.data, isValidInput: true});
            } else {
                this.setState({isValidInput: false});
            }
        });
        this.handleShowPopup();
    }

    successAuthentication() {
        return (
        <React.Fragment>
            <div className='popup-icon-green'>
                <ion-icon name="checkmark-circle-outline"></ion-icon>
            </div>
            <div className='popup-message'>
                Login Anda telah berhasil!<br />
                Selamat bekerja!
            </div>
            <div className='popup-confirm-btn'>
                <button onClick={() => {
                    this.props.handleSetLoggedInUser(this.state.loginData);
                    this.setState({isValidInput : null});
                }}>Konfirmasi</button>
            </div>
        </React.Fragment>
        );
    }

    throwsAuthenticationError() {
        return (
        <React.Fragment>
            <div className='popup-icon-red'>
                <ion-icon name="close-circle-outline"></ion-icon>
            </div>
            <div className='popup-message'>
                Kredensial yang diberikan<br />
                tidak ditemukan!
            </div>
            <div className='popup-confirm-btn'>
                <button onClick={() => this.setState({showPopup: false})}>Konfirmasi</button>
            </div>
        </React.Fragment>
        )
    }

    handleShowPopup() {
        this.setState({showPopup: !this.state.showPopup});
    }

    displayPopup() {
        return (
        <React.Fragment>
            <div className='popup-background'>
                <div className="popup-container">
                    <div className='popup-close-btn'>
                        <ion-icon name="close-outline" onClick={() => this.setState({showPopup: false})}></ion-icon>
                    </div>
                    {this.state.isValidInput != null ? <div className='popup-title'>Login Authentication</div> : null}
                    {this.state.isValidInput != null ? (this.state.isValidInput ? this.successAuthentication() : this.throwsAuthenticationError()) : <div className='popup-message'>Loading...</div>}
                </div>
            </div>
        </React.Fragment>
        )
    }

    render() { 
        return (
            <div id="landing-page-container">
                {this.state.showPopup? this.displayPopup() : null}
                <div id="landing-page-welcome">
                    <div id="landing-page-welcome-1">Halo, selamat datang di</div>
                    <div id="landing-page-welcome-2">MySurveyCompanion.</div>
                </div>
                <div className="vertical-separator"></div>
                <div id="landing-page-login-box">
                    <div id="landing-page-login-header">Login</div>
                    <div className='liner'></div>
                    <div className="landing-page-login-container">
                        <div className="landing-page-login-row">
                            <div className="landing-page-login-title">
                                <span>Email</span>
                                <span className='span-asterisk' style={{marginLeft: '5px'}}>*</span>
                            </div>
                            <div className="landing-page-input-container">
                                <input type="email" className="landing-page-login-field" id="login-useremail" />
                            </div>
                        </div>
                        <div className="landing-page-login-row">
                            <div className="landing-page-login-title">
                                <span>Password</span>
                                <span className='span-asterisk' style={{marginLeft: '5px'}}>*</span>
                            </div>
                            <div className="landing-page-input-container">
                                <input type="password" className="landing-page-login-field" id="login-password" />
                            </div>
                        </div>
                        <span>
                            <span className='span-asterisk'>*</span>
                            <span className='span-required'> Required fields</span>
                        </span>
                    </div>
                    <div id="landing-page-login-footer">
                        <div id="landing-page-login-button" onClick={this.handleLogin}>
                            Login
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}
 
export default LandingPage;