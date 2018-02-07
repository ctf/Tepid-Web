import React from 'react';
import {withRouter} from 'react-router-dom';
import {connect} from 'react-redux';

import TepidSidebar from '../components/TepidSidebar';
import PageHeader from '../components/PageHeader';

import AccountContainer from '../containers/AccountContainer';

class MyAccountPage extends React.Component {
	// TODO: Use cached values whenever possible?
	render() {
		return (
			<div>
				<TepidSidebar />
				<main>
					<PageHeader />
					<section id="page-content">
						<AccountContainer shortUser={this.props.auth.user.shortUser} />
					</section>
				</main>
			</div>
		);
	}
}

const mapStateToProps = (state, ownProps) => {
	return {
		auth: state.auth
	};
};

const mapDispatchToProps = (dispatch, ownProps) => {
	return {};
};

const MyAccountPageContainer = withRouter(connect(mapStateToProps, mapDispatchToProps)(MyAccountPage));

export default MyAccountPageContainer;
