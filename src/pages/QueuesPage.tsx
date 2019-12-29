import React, {useEffect} from 'react';
import {Redirect, Switch, withRouter} from 'react-router-dom';
import {connect} from 'react-redux';

import TepidSidebar from '../components/TepidSidebar';
import PageHeader from '../components/PageHeader';
import CardNav from '../components/CardNav';
import {CTFerRoute} from '../components/auth_routes';

import QueueContainer from '../containers/QueueContainer';
import {fetchDestinationsIfNeeded, fetchQueuesIfNeeded} from '../actions';
import {PrintQueue} from "../models";

function QueuesPage({queues, loading, match, fetchNeededData} : {queues: Map<String, PrintQueue>, loading: boolean, match: any, fetchNeededData: any }) {
	useEffect(() => {
		fetchNeededData();
	}, []);


	const navItems = Object.values(queues).map((queue: PrintQueue) => ({
		'text': queue._id,
		'link': `${match.url}/${queue._id}`
	}));

	return (
		<div>
			<TepidSidebar/>
			<main>
				<PageHeader/>
				<section id="page-content">
					<div className="card no-padding">
						<h2>
							Queues
							<CardNav navItems={navItems}/>
						</h2>
						<Switch>
							<CTFerRoute path={`${match.url}/:queueName`} component={QueueContainer}/>
							{loading || Object.entries(queues).length === 0
								? ''
								: (<Redirect to={`${match.url}/${Object.values(queues)[0]._id}`}/>)}
						</Switch>
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
		loading: state.queues.isFetching || state.queues.items.length === 0
	};
};

const mapDispatchToProps = (dispatch, ownProps) => {
	return {
		fetchNeededData: () => {
			dispatch(fetchQueuesIfNeeded()).then(() => fetchDestinationsIfNeeded());
		}
	};
};

const QueuesPageContainer = withRouter(connect(mapStateToProps, mapDispatchToProps)(QueuesPage));

export default QueuesPageContainer;
