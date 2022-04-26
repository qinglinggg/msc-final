import axios from 'axios';
import React, { Component } from 'react';

const BASE_URL = "http://10.61.38.193:8080";

class LandingPage extends Component {

    constructor(props) {
        super(props);
        this.handleLogin = this.handleLogin.bind(this);
        this.throwsAuthenticationError = this.throwsAuthenticationError.bind(this);
    }

    handleLogin() {
        let inputUserEmail = document.getElementById('login-useremail');
        let inputPassword = document.getElementById('login-password');

        let user = {
            'email': inputUserEmail.value,
            'password': inputPassword.value
        }

        try {
            axios({
                method: "post",
                data: user,
                url: `${BASE_URL}/api/v1/user-profiles/auth`
            }).then((res) => {
                if(res.data){
                    this.props.handleSetLoggedInUser(res.data);
                }
                else {
                    this.throwsAuthenticationError();
                }
            })
        } catch(error) {
            console.log(error);
        }
    }

    throwsAuthenticationError() {
        return (
            <div>User is not existed!</div>
        )
    }

    render() { 
        return (
            <div id="landing-page-container">
                <div id="landing-page-welcome">
                    <div id="landing-page-welcome-1">Halo, selamat datang di</div>
                    <div id="landing-page-welcome-2">MySurveyCompanion.</div>
                </div>
                <div id="landing-page-login-box">
                    <div id="landing-page-login-header">Login</div>
                    <div className='liner'></div>
                    <div className="landing-page-login-container">
                        <div className="landing-page-login-row">
                            <div className="landing-page-login-title">Email</div>
                            <div className="landing-page-input-container">
                                <input type="text" className="landing-page-login-field" id="login-useremail" />
                                <span>
                                    <span className='span-asterisk'>*</span>
                                    <span className='span-required'> Required fields</span>
                                </span>
                            </div>
                        </div>
                        <div className="landing-page-login-row">
                            <div className="landing-page-login-title">Password</div>
                            <div className="landing-page-input-container">
                                <input type="text" className="landing-page-login-field" id="login-password" />
                                <span>
                                    <span className='span-asterisk'>*</span>
                                    <span className='span-required'> Required fields</span>
                                </span>
                            </div>
                        </div>
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