import React from 'react';

import JobTable from './JobTable';

class Queue extends React.Component {
	componentWillReceiveProps(nextProps, nextContext) {
		this.props.fetchNeededData(nextProps.match.params.queueName);
	}

	render() {
		return (
			<div>
				<JobTable queueName={this.props.match.params.queueName}
						  jobs={this.props.jobs}
						  loading={this.props.loadingJobs}
						  showUser={true} />
				<div className="table-nav">
					<div className="page-text">
						Showing 1 to 100 of {this.props.jobs.length} jobs
					</div>
					<div className="page-buttons">
						<nav className="card-tabs icons-only small">
							<ul>
								<a><li><i className="material-icons">keyboard_arrow_left</i></li></a>
								<a><li><i className="material-icons">keyboard_arrow_right</i></li></a>
							</ul>
						</nav>
					</div>
				</div>
			</div>
		);
	}
}

export default Queue;
