import React from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';

import { attemptAuthAndLoadInitialData } from '../actions';

class SignInPage extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			username: '',
			password: ''
		};

		this.handleUsernameChange = this.handleUsernameChange.bind(this);
		this.handlePasswordChange = this.handlePasswordChange.bind(this);
	}

	handleUsernameChange(event) {
		this.setState({username: event.target.value});
	}

	handlePasswordChange(event) {
		this.setState({password: event.target.value});
	}

	render() {
		return (
			<main className="no-sidebar">
				<img src="/images/logo.svg" alt="TEPID" id="login-logo" />
				<form id="login-form">
					<div className="card">
						<h2>Sign In</h2>
						<label htmlFor="username">McGill Username</label>
						<input type="text" id="username" name="username"
							   value={this.state.username}
							   onChange={this.handleUsernameChange} />
						<label htmlFor="password">Password</label>
						<input type="password" id="password" name="password"
							   value={this.state.password}
							   onChange={this.handlePasswordChange} />
						<button className="primary" onClick={(event) => {
							event.preventDefault();
							return this.props.onSignInClick(this.state);
						}}>
							Sign In
						</button>
					</div>
				</form>
			</main>
		);
	}
}

const mapStateToProps = (state, ownProps) => {
	return {
		auth: state.auth
	};
};

const mapDispatchToProps = (dispatch, ownProps) => {
	return {
		onSignInClick: credentials => {
			dispatch(attemptAuthAndLoadInitialData(credentials));
		}
	};
};

const SignInPageContainer = withRouter(connect(mapStateToProps, mapDispatchToProps)(SignInPage));

export default SignInPageContainer;
