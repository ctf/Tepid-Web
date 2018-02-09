import React from 'react';

import JobTableRow from './JobTableRow';

class JobTable extends React.Component {
	render() {
		// TODO: Pagination
		const jobList = this.props.jobs.slice(0, 100)
			.map(job => (<JobTableRow key={job._id} job={job} showUser={this.props.showUser} />));
		// TODO: Fix Name width
		return (
			<div>
				<table className="job-list">
					<thead>
					<tr>
						<th style={{width: '11rem'}}>Started</th>
						{this.props.showUser ? (<th style={{width: '5.5rem'}}>User</th>) : ''}
						<th style={{width: '6.1rem'}}>Pages</th>
						<th style={{width: '12.3rem'}}>Status</th>
						<th style={{width: '7.7rem'}}>Host</th>
						<th style={{minWidth: '16rem'}}>Name</th>
						<th style={{width: '2.9rem'}}>&nbsp;</th>
					</tr>
					</thead>
					<tbody>
					{jobList}
					</tbody>
				</table>
			</div>
		);
	}
}

export default JobTable;
