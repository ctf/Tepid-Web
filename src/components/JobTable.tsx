import React from 'react';
import {Menu, Table} from "antd";
import {Link} from "react-router-dom";
import {jobStatus} from "../tepid-utils";
import {useDispatch, useSelector} from "react-redux";
import * as actions from "../actions";
import {MoreMenu} from "./Buttons/MoreButton";
import {PrintJob} from "../models";

function JobTable({loading, showUser, canRefund, jobs}) {

	const destinations = useSelector(state => state.destinations.items);
	const getDestination = (job) => destinations[job.destination];

	const dispatch = useDispatch();
	const makeHandleRefund = (job) => () => dispatch(actions.doSetJobRefunded(job, !job.refunded));
	const makeHandleReprint = (job) => () => dispatch(actions.doJobReprint(job));

	const columns = [
		{
			title: 'Started',
			key: 'Started',
			render: job => <>{job.started === -1 ? '' : new Date(job.started).toLocaleString('en-CA')}</>
		},
		...(showUser ? [{
			title: 'User',
			key: 'User',
			render: job => <Link to={`/accounts/${job.userIdentification}`}> {job.userIdentification}</Link>
		}] : []),
		{
			title: 'Pages',
			key: 'Pages',
			render: job => <>{`${job.pages} ${job.colorPages === 0 ? '' : ` (${job.colorPages} color)`}`}</>
		},
		{
			title: 'Status',
			key: 'Status',
			render: job => <>{jobStatus(job)}</>
		},
		{
			title: 'Destination',
			key: 'Destination',
			render: job => {
				const destination = getDestination(job);
				return <>{(destination && destination.name) || ""}</>
			}
		},
		{
			title: 'Name',
			key: 'Name',
			render: job => <>{job.name}</>
		},
		{
			title: '',
			key: 'MoreMenu',
			render: job => <MoreMenu>
				{canRefund && <Menu.Item onClick={makeHandleRefund(job)}>Refund</Menu.Item>}
				<Menu.Item onClick={makeHandleReprint(job)}>Reprint</Menu.Item></MoreMenu>

		}
	];

	return (
		<div style={{borderTop: "1px solid rgba(0, 0, 0, 0.08)"}}>
			<Table columns={columns}
				   dataSource={jobs}
				   loading={loading}
				   rowKey={(record: PrintJob, _) => record._id || ""}/>
		</div>
	);
}

export default JobTable;
