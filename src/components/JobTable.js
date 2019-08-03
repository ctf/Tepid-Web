import React, {useState} from 'react';

import JobTableRow from './JobTableRow';
import TableHead from "@material-ui/core/TableHead";
import {TableRow} from "@material-ui/core";
import TableCell from "@material-ui/core/TableCell";
import TableBody from "@material-ui/core/TableBody";


function JobTable({loading, showUser, canRefund, jobs}) {

	const [offset, setOffset] = useState(0);
	const [pageSize, setPageSize] = useState(100);

	const handlePageBack = () => {
		setOffset(Math.max(0, offset - pageSize));
	};

	const handlePageForward = () => {
		if (offset + pageSize < jobs.length) {
			setOffset(offset + pageSize)
		}
	};

	const colSpan = showUser ? 7 : 6;

	let jobList = jobs.slice(offset, offset + pageSize)
		.map(job => (<JobTableRow key={job._id} job={job} showUser={showUser} canRefund={canRefund}/>));

	if (loading) {
		jobList = (<tr>
			<td colSpan={colSpan} style={{textAlign: 'center'}}>Loading...</td>
		</tr>);
	}

	return (
		<div>
			<table className="job-list">
				<TableHead>
					<TableRow>
						<TableCell style={{width: '20%'}}>Started</TableCell>
						{
							showUser
								? (<th style={{width: '15%'}}>User</th>)
								: ''
						}
						<TableCell style={{width: '10%'}}>Pages</TableCell>
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
			{loading
				? ''
				: (
					<div className="table-nav">
						<div className="page-text">
						<span>
							Showing {offset + 1} to&nbsp;
							{Math.min(offset + pageSize, jobs.length)} of&nbsp;
							{jobs.length} jobs
						</span>
						</div>
						<div className="page-buttons">
							{pageSize < jobs.length ? (<nav className="card-tabs icons-only small">
								<ul>
									<a onClick={handlePageBack}>
										<li><i className="material-icons">keyboard_arrow_left</i></li>
									</a>
									<a onClick={handlePageForward}>
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

export default JobTable;
