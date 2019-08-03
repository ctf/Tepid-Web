import React from 'react';
import {Link} from 'react-router-dom';

import {jobStatus, jobHasFailed} from '../tepid-utils';
import {MoreMenu} from "./Buttons/MoreButton";
import MenuItem from "@material-ui/core/MenuItem";
import {TableRow} from "@material-ui/core";
import TableCell from "@material-ui/core/TableCell";
import {useDispatch} from "react-redux";
import * as actions from "../actions";

function JobTableRow({showUser, canRefund, job}) {

	const dispatch = useDispatch();
	const doSetJobRefunded = (job, refunded) => dispatch(actions.doSetJobRefunded(job, refunded));

	const handleRefund = () => {
		doSetJobRefunded(job, !job.refunded)
	};

	const colorPages = job.colorPages;
	return (
		<TableRow className={jobHasFailed(job) ? 'failed' : ''}>
			<TableCell>{job.started === -1 ? '' : new Date(job.started).toLocaleString('en-CA')}</TableCell>
			{showUser ? (
				<TableCell>
					<Link to={`/accounts/${job.userIdentification}`}>
						{job.userIdentification}
					</Link>
				</TableCell>
			) : ''}
			<TableCell>{`${job.pages} ${colorPages === 0 ? '' : ` (${colorPages} color)`}`}</TableCell>
			<TableCell>{jobStatus(job)}</TableCell>
			<TableCell>{job.originalHost}</TableCell>
			<TableCell>{job.name}</TableCell>
			<TableCell>
				<MoreMenu>
					{canRefund && <MenuItem onClick={handleRefund}>Refund</MenuItem>}
					<MenuItem>Reprint</MenuItem>
				</MoreMenu>
			</TableCell>
		</TableRow>
	);
}

export default JobTableRow;
