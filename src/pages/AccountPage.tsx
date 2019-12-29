import React from 'react';
import {withRouter} from 'react-router-dom';
import {connect} from 'react-redux';

import TepidSidebar from '../components/TepidSidebar';
import PageHeader from '../components/PageHeader';
import {CTFerRoute} from '../components/auth_routes';

import AccountContainer from '../containers/AccountContainer';

function AccountPage({match}) {
	return (
		<div>
			<TepidSidebar/>
			<main>
				<PageHeader/>
				<section id="page-content">
					<CTFerRoute path={`${match.url}/:shortUser`} component={AccountContainer}/>
				</section>
			</main>
		</div>
	);
}

const mapStateToProps = (state, ownProps) => {
	return {
		auth: state.auth
	};
};

const mapDispatchToProps = (dispatch, ownProps) => {
	return {};
};

const AccountPageContainer = withRouter(connect(mapStateToProps, mapDispatchToProps)(AccountPage));

export default AccountPageContainer;
