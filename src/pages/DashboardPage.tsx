import React, {useEffect} from 'react';
import {withRouter} from 'react-router-dom';
import {connect} from 'react-redux';

import TepidSidebar from '../components/TepidSidebar';
import PageHeader from '../components/PageHeader';

import DashboardPrinter from '../components/DashboardPrinter';
import {fetchDestinationsIfNeeded, fetchQueuesIfNeeded} from "../actions";

function DashboardPage({queues, fetchNeededData}) {
	useEffect(() => {
		fetchNeededData()
	});

	const dashboardPrinters = Object.entries(queues).map(([k, v]) => (<DashboardPrinter key={k} queue={v}/>));

	return (
		<div>
			<TepidSidebar/>
			<main>
				<PageHeader/>
				<section id="page-content">
					<div className="card no-padding">
						<div className="row">
							{dashboardPrinters}
						</div>
					</div>
				</section>
			</main>
		</div>
	);
}

const mapStateToProps = (state, ownProps) => {
	return {
		match: ownProps.match,
		queues: state.queues.items,
		loading: state.queues.isFetching
	};
};

const mapDispatchToProps = (dispatch, ownProps) => ({
	fetchNeededData: async () => {
		await dispatch(fetchQueuesIfNeeded());
		await dispatch(fetchDestinationsIfNeeded());
	}
});

const DashboardPageContainer = withRouter(connect(mapStateToProps, mapDispatchToProps)(DashboardPage));

export default DashboardPageContainer;
