import React from 'react';
import {withRouter} from 'react-router-dom';
import {connect} from 'react-redux';

import TepidSidebar from '../components/TepidSidebar';
import PageHeader from '../components/PageHeader';

import AccountContainer from '../containers/AccountContainer';

function MyAccountPage ({auth}) {
	// TODO: Use cached values whenever possible?
		return (
			<div>
				<TepidSidebar />
				<main>
					<PageHeader />
					<section id="page-content">
						<AccountContainer shortUser={auth.user.shortUser} />
					</section>
				</main>
			</div>
		);
}

const mapStateToProps = (state) => ({
	auth: state.auth
});

const MyAccountPageContainer = withRouter(connect(mapStateToProps)(MyAccountPage));

export default MyAccountPageContainer;
