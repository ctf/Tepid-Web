import React from 'react';
import {Link} from 'react-router-dom';

import {jobStatus, jobHasFailed} from '../tepid-utils';
import {MoreMenu} from "./Buttons/MoreButton";
import MenuItem from "@material-ui/core/MenuItem";
import Menu from "@material-ui/core/Menu";
import {TableRow} from "@material-ui/core";
import TableCell from "@material-ui/core/TableCell";

function JobTableRow (props) {

		const colorPages = props.job.colorPages;
		return (
			<TableRow className={jobHasFailed(props.job) ? 'failed' : ''}>
				<TableCell>{props.job.started === -1 ? '' : new Date(props.job.started).toLocaleString('en-CA')}</TableCell>
				{props.showUser ? (
					<TableCell>
						<Link to={`/accounts/${props.job.userIdentification}`}>
							{props.job.userIdentification}
						</Link>
					</TableCell>
				) : ''}
				<TableCell>{`${props.job.pages} ${colorPages === 0 ? '' : ` (${colorPages} color)`}`}</TableCell>
				<TableCell>{jobStatus(props.job)}</TableCell>
				<TableCell>{props.job.originalHost}</TableCell>
				<TableCell>{props.job.name}</TableCell>
				<TableCell>
					<MoreMenu>
						<MenuItem>Refund</MenuItem>
						<MenuItem>Reprint</MenuItem>
					</MoreMenu>
				</TableCell>
			</TableRow>
		);

}

export default JobTableRow;
