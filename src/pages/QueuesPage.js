import React from 'react';
import {Redirect, Switch, withRouter} from 'react-router-dom';
import {connect} from 'react-redux';

import TepidSidebar from '../components/TepidSidebar';
import PageHeader from '../components/PageHeader';
import CardNav from '../components/CardNav';
import { CTFerRoute } from '../components/auth_routes';

import QueueContainer from '../containers/QueueContainer';
import { fetchDestinationsIfNeeded, fetchQueuesIfNeeded } from '../actions';

class QueuesPage extends React.Component {
	componentWillMount() {
		this.props.fetchNeededData();
	}

	render() {
		const navItems = Object.values(this.props.queues).map(queue => ({
			'text': queue._id,
			'link': `${this.props.match.url}/${queue._id}`
		}));

		console.log(this.props.queues)

		return (
			<div>
				<TepidSidebar />
				<main>
					<PageHeader />
					<section id="page-content">
						<div className="card no-padding">
							<h2>
								Queues
								<CardNav navItems={navItems} />
							</h2>
							<Switch>
								<CTFerRoute path={`${this.props.match.url}/:queueName`} component={QueueContainer} />
								{this.props.loading || Object.entries(this.props.queues).length === 0
									? ''
									: (<Redirect to={`${this.props.match.url}/${Object.values(this.props.queues)[0]._id}`} />)}
							</Switch>
						</div>
					</section>
				</main>
			</div>
		);
	}
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
