import React, {useEffect} from 'react';
import {withRouter} from 'react-router-dom';
import {connect} from 'react-redux';

import TepidSidebar from '../components/TepidSidebar';
import PageHeader from '../components/PageHeader';

import {fetchDestinationsIfNeeded} from '../actions';

function DestinationsPage({fetchNeededData}) {
	useEffect(() => {
		fetchNeededData();
	}, []);
	return (
		<div>
			<TepidSidebar/>
			<main>
				<PageHeader/>
				<section id="page-content">
					<div className="card no-padding">
						<h2>Destinations</h2>
						{/*<CTFerRoute path={`${this.props.match.url}/:destName`}*/}
						{/*component={DestinationContainer} />*/}
					</div>
				</section>
			</main>
		</div>
	);
}

const mapStateToProps = (state, ownProps) => {
	return {
		match: ownProps.match,
		queues: state.destinations.items,
		loading: state.destinations.isFetching || state.destinations.items.length === 0
	};
};

const mapDispatchToProps = (dispatch, ownProps) => {
	return {
		fetchNeededData: () => {
			dispatch(fetchDestinationsIfNeeded());
		}
	};
};

const DestinationsPageContainer = withRouter(connect(mapStateToProps, mapDispatchToProps)(DestinationsPage));

export default DestinationsPageContainer;
