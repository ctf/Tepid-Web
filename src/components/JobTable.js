import React from 'react';

import JobTableRow from './JobTableRow';

class JobTable extends React.Component {
	render() {
		let i = 1;
		// TODO: Pagination
		const jobList = this.props.jobs.slice(0, 100).map(job => (<JobTableRow key={job._id} job={job} />));
		// TODO: Fix Name width
		return (
			<div>
				<table className="job-list">
					<thead>
					<tr>
						<th style={{width: '11.7em'}}>Started</th>
						<th style={{width: '6.1em'}}>User</th>
						<th style={{width: '6.2em'}}>Pages</th>
						<th style={{width: '6.5em'}}>Status</th>
						<th style={{width: '8.1em'}}>Host</th>
						<th style={{minWidth: '16em'}}>Name</th>
						<th style={{width: '1.7em'}}>&nbsp;</th>
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
