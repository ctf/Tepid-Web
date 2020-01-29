import React from 'react';
import { Route, Redirect, withRouter } from 'react-router-dom';
import { connect } from 'react-redux';

const mapStateToProps = (state, ownProps) => ({
	auth: state.auth
});

const mapDispatchToProps = (dispatch, ownProps) => ({});

const InnerElderRoute = ({ component: Component, auth, ...rest }) => (
	<Route {...rest} render={props => (
		(auth.role === 'elder' && !auth.didInvalidate) ? (
			<Component {...props} />
		) : (
			<Redirect to={{
				pathname: '/sign-in',
				state: { from: props.location }
			}} />
		)
	)} />
);

export const ElderRoute = withRouter(connect(mapStateToProps, mapDispatchToProps)(InnerElderRoute));

const InnerCTFerRoute = ({ component: Component, auth, ...rest }) => (
	<Route {...rest} render={props => (
		(['ctfer', 'elder'].includes(auth.role) && !auth.didInvalidate) ? (
			<Component {...props} />
		) : (
			<Redirect to={{
				pathname: '/sign-in',
				state: { from: props.location }
			}} />
		)
	)} />
);

export const CTFerRoute = withRouter(connect(mapStateToProps, mapDispatchToProps)(InnerCTFerRoute));

const InnerUserRoute = ({ component: Component, auth, ...rest }) => (
	<Route {...rest} render={props => (
		(['user', 'ctfer', 'elder'].includes(auth.role) && !auth.didInvalidate) ? (
			<Component {...props} />
		) : (
			<Redirect to={{
				pathname: '/sign-in',
				state: { from: props.location }
			}} />
		)
	)} />
);

export const UserRoute = withRouter(connect(mapStateToProps, mapDispatchToProps)(InnerUserRoute));

const InnerGuestRoute = ({ component: Component, auth, ...rest }) => (
	<Route {...rest} render={props => (
		(!auth.role || auth.role === '' || auth.didInvalidate) ? (
			<Component {...props} />
		) : (
			<Redirect to={{
				pathname: '/',
				state: { from: props.location }
			}} />
		)
	)} />
);

export const GuestRoute = withRouter(connect(mapStateToProps, mapDispatchToProps)(InnerGuestRoute));
