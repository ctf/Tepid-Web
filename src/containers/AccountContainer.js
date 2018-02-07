import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import Account from '../components/Account';

const mapStateToProps = (state, ownProps) => ({
	auth: this.state.auth
});

const mapDispatchToProps = (dispatch, ownProps) => {
	return {
		fetchNeededData: (queueName) => {
			// TODO dispatch(fetchQueueJobsIfNeeded(queueName));
		}
	};
};

const QueueContainer = withRouter(connect(mapStateToProps, mapDispatchToProps)(Account));

export default QueueContainer;
