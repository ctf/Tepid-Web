import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import Queue from '../components/Queue';
import { fetchQueueJobsIfNeeded } from "../actions";

const mapStateToProps = (state, ownProps) => {
	const queueJobs = state.queues.jobsByQueue[ownProps.match.params.queueName];

	return {
		match: ownProps.match,
		jobs: queueJobs ? queueJobs.items : []
	};
};

const mapDispatchToProps = (dispatch, ownProps) => {
	return {
		fetchNeededData: (queueName) => {
			dispatch(fetchQueueJobsIfNeeded(queueName));
		}
	};
};

const QueueContainer = withRouter(connect(mapStateToProps, mapDispatchToProps)(Queue));

export default QueueContainer;
