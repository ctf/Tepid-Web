import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';

import QueuesCard from '../components/QueuesCard';

const mapStateToProps = (state, ownProps) => {
	return {
		match: ownProps.match,
		queues: state.queues.items,
		loading: state.queues.isFetching
	};
};

const mapDispatchToProps = (dispatch, ownProps) => {
	return {};
};

const QueuesContainer = withRouter(connect(mapStateToProps, mapDispatchToProps)(QueuesCard));

export default QueuesContainer;
