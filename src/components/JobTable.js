import React from 'react';

import JobTableRow from './JobTableRow';
import TableHead from "@material-ui/core/TableHead";
import {TableRow} from "@material-ui/core";
import TableCell from "@material-ui/core/TableCell";
import TableBody from "@material-ui/core/TableBody";

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
		const colSpan = this.props.showUser ? 7 : 6;

		let jobList = this.props.jobs.slice(this.state.offset, this.state.offset + this.state.pageSize)
			.map(job => (<JobTableRow key={job._id} job={job} showUser={this.props.showUser} />));

		if (this.props.loading) {
			jobList = (<tr><td colSpan={colSpan} style={{textAlign: 'center'}}>Loading...</td></tr>);
		}

		return (
			<div>
				<table className="job-list">
					<TableHead>
					<TableRow>
						<TableCell style={{width: '20%'}}>Started</TableCell>
						{
							this.props.showUser
								? (<th style={{width: '15%'}}>User</th>)
								: ''
						}
						<TableCell style={{width: '10%' }}>Pages</TableCell>
						<TableCell style={{width: '20%'}}>Status</TableCell>
						<TableCell style={{width: '15%'}}>Host</TableCell>
						<TableCell style={{}}>Name</TableCell>
						<TableCell style={{width: '6%'}}>&nbsp;</TableCell>
					</TableRow>
					</TableHead>
					<TableBody>
					{jobList}
					</TableBody>
				</table>
				{this.props.loading
					? ''
					: (
						<div className="table-nav">
							<div className="page-text">
						<span>
							Showing {this.state.offset + 1} to&nbsp;
							{Math.min(this.state.offset + this.state.pageSize, this.props.jobs.length)} of&nbsp;
							{this.props.jobs.length} jobs
						</span>
							</div>
							<div className="page-buttons">
								{this.state.pageSize < this.props.jobs.length ? (<nav className="card-tabs icons-only small">
									<ul>
										<a onClick={this.handlePageBack}>
											<li><i className="material-icons">keyboard_arrow_left</i></li>
										</a>
										<a onClick={this.handlePageForward}>
											<li><i className="material-icons">keyboard_arrow_right</i></li>
										</a>
									</ul>
								</nav>) : ''}
							</div>
						</div>
					)
				}
			</div>
		);
	}
}

export default JobTable;
