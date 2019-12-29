import React, {useEffect} from 'react';
import {connect, useDispatch} from 'react-redux';
import {Link, withRouter} from 'react-router-dom';

import {
	fetchDestinationsIfNeeded,
	fetchQueueJobsIfNeeded,
	resolveDestinationTicket,
	submitDestinationTicket
} from '../actions';
import {jobHasFailed, jobStatus} from '../tepid-utils';
import useModal from "../hooks/useModal";
import {useFormField} from "../hooks/useFormField";
import styled from 'styled-components'
import {Button, Card, Form, Input, Modal} from "antd";
import TextArea from "antd/es/input/TextArea";


function AddTicketDialog({destination, ticket, modal}) {
	const dispatch = useDispatch();

	const text = useFormField((ticket && ticket.reason) || '');

	const handleSubmit = (event) => {
		event.preventDefault();
		dispatch(submitDestinationTicket(destination, text.value));
	};
	const handleResolve = () => {
		dispatch(resolveDestinationTicket(destination))
	};

	return (
		<Modal title={`Add ticket for destination ${destination.name}`} visible={modal.open}
			   footer={[
				   ...(ticket ? [<Button type={"primary"} onClick={handleResolve}> Resolve</Button>] : []),
				   <Button type={'danger'} onClick={handleSubmit}>Submit</Button>
			   ]}
			   onCancel={modal.handleClose}
		>
			<Form>
				<Form.Item label={'Ticket'}>
					<TextArea rows={4} {...text}/>
				</Form.Item>
			</Form>
		</Modal>
	)
}

function QueueDestinationClicker({dest}) {
	const addTicketModal = useModal();
	const iconClass = dest.up ? 'up' : 'down';
	const iconText = dest.up ? 'arrow_upward' : 'arrow_downward';
	return (
		<>
			<div key={dest._id} onClick={addTicketModal.handleOpen}>
				<i className={`material-icons ${iconClass}`}>{iconText}</i> {dest.name}
			</div>
			<AddTicketDialog destination={dest} ticket={dest.ticket} modal={addTicketModal}/>
		</>
	);

}

const PrinterUpIcon = styled.i`
	color: #4D983E
`;
const PrinterDownIcon = styled.i`
	color: #F44336;
`;

function PrinterIconHalf({up}) {
	return up ? <PrinterUpIcon className="material-icons"> print </PrinterUpIcon> :
		<PrinterDownIcon className="material-icons"> print </PrinterDownIcon>
}

function QueueIcon({destinations}) {
	const hasUp = destinations.reduce((acc, it) => (acc || it.up), false);
	const allUp = destinations.reduce((acc, it) => (acc && it.up), true);

	return <div className="printer-status-display">
		<PrinterIconHalf up={allUp}/>
		<PrinterIconHalf up={hasUp}/>
	</div>;
}

function DashboardPrinter({queue, destinations, loadingDestinations, jobs, queueJobs, loadingQueueJobs, fetchNeededData}) {

	useEffect(() => {
		fetchNeededData()
	});

	if (loadingDestinations) return (<div className="col"><Card loading={loadingDestinations}></Card></div>);

	const queueDestinations = queue.destinations
		.map(dest => destinations[dest])
		.sort((d1, d2) => d1.name.localeCompare(d2));

	const queueDestinationClickers = queueDestinations.map(dest => <QueueDestinationClicker dest={dest}/>);

	const jobsToShow = queueJobs.slice(0, 25).map(it => jobs.items[it]);
	const queueJobsElement = loadingQueueJobs
		? (<tr style={{borderBottom: 'none'}}>
			<td colSpan={4} style={{textAlign: 'center'}}>Loading...</td>
		</tr>)
		: jobsToShow.map(job => (
			<tr key={job._id} className={jobHasFailed(job) ? 'failed' : ''}>
				<td><Link to={`/accounts/${job.userIdentification}`}>{job.userIdentification}</Link></td>
				<td>{destinations[job.destination]
					? destinations[job.destination].name
					: ''}</td>
				<td>{jobStatus(job)}</td>
				<td><i className="material-icons">more_vert</i></td>
			</tr>
		));

	return (
		<div className="col dash-printer no-side-padding no-bottom-padding">
			<QueueIcon destinations={queueDestinations}/>
			<h2>{queue.name}</h2>
			<div className="printer-status">{queueDestinationClickers}</div>
			<table className="dash-printer-queue">
				<thead>
				<tr>
					<th style={{width: '5.8rem'}}>User</th>
					<th style={{width: '5.8rem'}}>Printer</th>
					<th style={{minWidth: '12.3rem'}}>Status</th>
					<th style={{width: '2.9rem'}}>&nbsp;</th>
				</tr>
				</thead>
				<tbody>{queueJobsElement}</tbody>
			</table>
		</div>
	);
}

const mapStateToProps = (state, ownProps) => {
	const loading = state.queues.jobsByQueue[ownProps.queue._id].isFetching || state.destinations.isFetching;
	const unloaded = state.queues.jobsByQueue[ownProps.queue._id].items.length === 0;

	const loadingDestinations = Object.keys(state.destinations.items).length === 0;

	return {
		queue: ownProps.queue,
		queueJobs: state.queues.jobsByQueue[ownProps.queue._id].items,
		destinations: state.destinations.items,
		loading: unloaded || loading || loadingDestinations,
		loadingDestinations: loadingDestinations,
		loadingQueueJobs: unloaded || loading,
		jobs: state.jobs
	};
};

const mapDispatchToProps = (dispatch, ownProps) => {
	return {
		fetchNeededData: () => {
			dispatch(fetchDestinationsIfNeeded()).then(() => dispatch(fetchQueueJobsIfNeeded(ownProps.queue._id)));
		}
	};
};

const DashboardPrinterContainer = withRouter(connect(mapStateToProps, mapDispatchToProps)(DashboardPrinter));

export default DashboardPrinterContainer;
