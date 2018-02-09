import React from 'react';

import JobTableRow from './JobTableRow';

class JobTable extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			offset: 0,
			pageSize: 100
		};

		this.handlePageBack = this.handlePageBack.bind(this);
		this.handlePageForward = this.handlePageForward.bind(this);
	}

	handlePageBack() {
		this.setState(prevState => ({
			offset: Math.max(0, prevState.offset - prevState.pageSize)
		}));
	}

	handlePageForward() {
		if (this.state.offset + this.state.pageSize < this.props.jobs.length) {
			this.setState(prevState => ({
				offset: prevState.offset + prevState.pageSize
			}));
		}
	}

	render() {
		// TODO: Pagination
		const jobList = this.props.jobs.slice(this.state.offset, this.state.offset + this.state.pageSize)
			.map(job => (<JobTableRow key={job._id} job={job} showUser={this.props.showUser} />));

		return (
			<div>
				<table className="job-list">
					<thead>
					<tr>
						<th style={{width: '11rem'}}>Started</th>
						{
							this.props.showUser
								? (<th style={{width: '5.8rem'}}>User</th>)
								: ''
						}
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
				<div className="table-nav">
					<div className="page-text">
						Showing {this.state.offset + 1} to {Math.min(this.state.offset + this.state.pageSize, this.props.jobs.length)} of&nbsp;
						{this.props.jobs.length} jobs
					</div>
					<div className="page-buttons">
						<nav className="card-tabs icons-only small">
							<ul>
								<a onClick={this.handlePageBack}>
									<li><i className="material-icons">keyboard_arrow_left</i></li>
								</a>
								<a onClick={this.handlePageForward}>
									<li><i className="material-icons">keyboard_arrow_right</i></li>
								</a>
							</ul>
						</nav>
					</div>
				</div>
			</div>
		);
	}
}

export default JobTable;
