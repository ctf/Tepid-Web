import React from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';

import TepidSidebar from '../components/TepidSidebar';
import PageHeader from '../components/PageHeader';

class StatisticsPage extends React.Component {
	render() {
		return (
			<div>
				<TepidSidebar />
				<main>
					<PageHeader />
					<section id="page-content">

					</section>
				</main>
			</div>
		);
	}
}

const mapStateToProps = (state, ownProps) => {
	return {};
};

const mapDispatchToProps = (dispatch, ownProps) => {
	return {};
};

const StatisticsPageContainer = withRouter(connect(mapStateToProps, mapDispatchToProps)(StatisticsPage));

export default StatisticsPageContainer;
