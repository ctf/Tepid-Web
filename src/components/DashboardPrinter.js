import React from 'react';
import {connect} from 'react-redux';
import {Link, withRouter} from 'react-router-dom';

import {fetchDestinationsIfNeeded, fetchQueueJobsIfNeeded} from '../actions';
import {jobHasFailed, jobStatus} from '../tepid-utils';

class DashboardPrinter extends React.Component {
	componentWillMount() {
		this.props.fetchNeededData();
	}

	render() {
		if (this.props.loadingDestinations) return (<div className="col"> </div>);

		const queueDestinations = this.props.queue.destinations
			.map(dest => this.props.destinations[dest])
			.sort((d1, d2) => d1.name.localeCompare(d2));

		const queueDestinationClickers = queueDestinations.map(dest => {
			const iconClass = dest.up ? 'up' :'down';
			const iconText = dest.up ? 'arrow_upward' :'arrow_downward';
			return (
				<a href="" key={dest._id}>
					<i className={`material-icons ${iconClass}`}>{iconText}</i> {dest.name}
				</a>
			);
		});

		const queueJobs = this.props.loadingQueueJobs
			? (<tr style={{borderBottom: 'none'}}><td colSpan="4" style={{textAlign: 'center'}}>Loading...</td></tr>)
			: this.props.queueJobs.slice(0, 25).map(job => (
				<tr key={job._id} className={jobHasFailed(job) ? 'failed' : ''}>
					<td><Link to={`/accounts/${job.userIdentification}`}>{job.userIdentification}</Link></td>
					<td>{this.props.destinations[job.destination]
							? this.props.destinations[job.destination].name
							: ''}</td>
					<td>{jobStatus(job)}</td>
					<td><i className="material-icons">more_vert</i></td>
				</tr>
			));

		return (
			<div className="col dash-printer no-side-padding no-bottom-padding">
				<div className="printer-status-display">
					<i className="material-icons">print</i>
					<i className="material-icons">print</i>
				</div>
				<h2>{this.props.queue.name}</h2>
				<div className="printer-status">{queueDestinationClickers}</div>
				<table className="dash-printer-queue">
					<thead>
					<tr>
						<th style={{width: '5.8rem'}}>User</th>
						<th style={{width: '5.8rem'}}>Printer</th>
						<th style={{minWidth: '12.3rem'}}>Status</th>
						<th style={{width: '2.9rem'}}>&nbsp;</th>
					</tr>
					</thead>
					<tbody>{queueJobs}</tbody>
				</table>
			</div>
		);
	}
}

const mapStateToProps = (state, ownProps) => {
	const loading = state.queues.jobsByQueue[ownProps.queue.name].isFetching || state.destinations.isFetching;
	const unloaded = state.queues.jobsByQueue[ownProps.queue.name].items.length === 0;

	const loadingDestinations = Object.keys(state.destinations.items).length === 0;

	return {
		queue: ownProps.queue,
		queueJobs: state.queues.jobsByQueue[ownProps.queue.name].items,
		destinations: state.destinations.items,
		loading: unloaded || loading || loadingDestinations,
		loadingDestinations: loadingDestinations,
		loadingQueueJobs: unloaded || loading
	};
};

const mapDispatchToProps = (dispatch, ownProps) => {
	return {
		fetchNeededData: () => {
			dispatch(fetchDestinationsIfNeeded()).then(() => dispatch(fetchQueueJobsIfNeeded(ownProps.queue.name)));
		}
	};
};

const DashboardPrinterContainer = withRouter(connect(mapStateToProps, mapDispatchToProps)(DashboardPrinter));

export default DashboardPrinterContainer;
