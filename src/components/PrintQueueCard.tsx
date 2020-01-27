import React, {useCallback, useState} from "react";
import {Button, Card, Col, Form, Modal, Row} from "antd";
import {useDispatch} from "react-redux";
import * as actions from "../actions";
import {FullDestination, PrintQueue} from "../models";
import {FormComponentProps} from 'antd/lib/form/Form';
import FormBuilder from 'antd-form-builder'
import {QueueIcon} from "./QueueIcon";

interface ConfigPrintQueueArgs extends FormComponentProps {
	printQueue: PrintQueue,
	destinations: FullDestination[]
}

function InnerConfigPrintQueue({form, printQueue, destinations}: ConfigPrintQueueArgs) {

	const [q, sq] = useState(printQueue);

	const dispatch = useDispatch();

	const [viewMode, setViewMode] = useState(true);
	const [pending, setPending] = useState(false);
	const handleUpdate = useCallback(
		evt => {
			evt.preventDefault();
			const values = form.getFieldsValue();
			console.log('Submit: ', values);
			setPending(true);
			const n = Object.assign({}, q, values)
			sq(n);
			dispatch(actions.putQueue(n)).then(
				() => {
					setPending(false);
					// setPersonalInfo(values);
					setViewMode(true);
					Modal.success({
						title: 'Success',
						content: 'Infomation updated.',
					})
				})
		},
		[form],
	);

	const handleDelete = useCallback(
		evt => {
			evt.preventDefault();
			setPending(true);
			setViewMode(true);
			dispatch(actions.deleteQueue(q)).then(
				() => {
					setPending(false);
					// setPersonalInfo(values);
					setViewMode(true);
					Modal.success({
						title: 'Success',
						content: 'Deleted.',
					})
				})
		},
		[form],
	);


	const meta = {
		columns: 2,
		disabled: pending,
		fields: [
			{key: 'name', label: 'Name', required: true, initialValue: q.name},
			{key: 'loadBalancer', label: 'Loadbalancer', required: true, initialValue: q.loadBalancer},
			{key: 'defaultOn', label: 'Default for', initialValue: q.defaultOn},
			{
				key: 'destinations',
				label: 'Destinations',
				widget: 'checkbox-group',
				options: Object.keys(destinations),
				initialValue: q.destinations
			}
		]
	};

	return (
		<Card title={printQueue.name} extra={viewMode && (
			<Button type="link" onClick={() => setViewMode(false)} style={{float: 'right'}}>
				Edit
			</Button>
		)}>
			<Row>
				<Col span={8}>
					<QueueIcon
						destinations={q.destinations?.map(dest => destinations[dest]).filter(x => x !== undefined) || []}/>
				</Col>
				<Col>
					<Form layout="horizontal" onSubmit={handleUpdate}>
						<FormBuilder form={form} meta={meta} viewMode={viewMode}/>
						{!viewMode && (
							<Form.Item className="form-footer" wrapperCol={{span: 16, offset: 4}}>
								<Button htmlType="submit" type="primary" disabled={pending}>
									{pending ? 'Updating...' : 'Update'}
								</Button>
								<Button onClick={() => {
									form.resetFields();
									setViewMode(true)
								}} style={{marginLeft: '15px'}}>
									Cancel
								</Button>
								<Button
									type="danger"
									onClick={handleDelete}>
									Delete
								</Button>
							</Form.Item>
						)}
					</Form>
				</Col>
			</Row>
		</Card>
	)
}

export default Form.create()(InnerConfigPrintQueue)
