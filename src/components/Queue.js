import React from 'react';

import JobTable from './JobTable';

class Queue extends React.Component {
	componentWillReceiveProps(nextProps, nextContext) {
		this.props.fetchNeededData(nextProps.match.params.queueName);
	}

	render() {
		return (
			<JobTable queueName={this.props.match.params.queueName} jobs={this.props.jobs} showUser={true} />
		);
	}
}

export default Queue;
