import React, {useState} from 'react';
import {withRouter} from 'react-router-dom';
import {connect} from 'react-redux';

import {attemptAuthAndLoadInitialData} from '../actions';

function SignInPage(props) {

	const [username, setUsername] = useState('');
	const [password, setPassword] = useState('');

	const handleUsernameChange = (event) => {
		setUsername(event.target.value);
	};

	const handlePasswordChange = (event) => {
		setPassword(event.target.value);
	};

	return (
		<main className="no-sidebar">
			<img src="/images/logo.svg" alt="TEPID" id="login-logo"/>
			<form id="login-form">
				<div className="card">
					<h2>Sign In</h2>
					<label htmlFor="username">McGill Username</label>
					<input type="text" id="username" name="username"
						   value={username}
						   onChange={handleUsernameChange}/>
					<label htmlFor="password">Password</label>
					<input type="password" id="password" name="password"
						   value={password}
						   onChange={handlePasswordChange}/>
					<button className="primary" onClick={(event) => {
						event.preventDefault();
						return props.onSignInClick({username, password});
					}}>
						Sign In
					</button>
				</div>
			</form>
		</main>
	);
}

const mapStateToProps = state => ({
	auth: state.auth
});

const mapDispatchToProps = dispatch => ({
	onSignInClick: credentials => dispatch(attemptAuthAndLoadInitialData(credentials))
});

const SignInPageContainer = withRouter(connect(mapStateToProps, mapDispatchToProps)(SignInPage));

export default SignInPageContainer;
