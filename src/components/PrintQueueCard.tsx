import React, {useCallback, useState} from "react";
import {Button, Card, Form, Modal} from "antd";
import {useDispatch} from "react-redux";
import * as actions from "../actions";
import {PrintQueue} from "../models";
import {FormComponentProps} from 'antd/lib/form/Form';
import FormBuilder from 'antd-form-builder'

interface i extends FormComponentProps {
	printQueue: PrintQueue
}

function PQ({form, printQueue}: i) {

	const [q, sq] = useState(printQueue);

	const dispatch = useDispatch();

	const [viewMode, setViewMode] = useState(true)
	const [pending, setPending] = useState(false);
	const handleSubmit = useCallback(
		evt => {
			evt.preventDefault();
			const values = form.getFieldsValue();
			console.log('Submit: ', values);
			setPending(true);
			const n = Object.assign({}, q, values)
			sq(n);
			dispatch(actions.putQueue(n));
			setTimeout(() => {
				setPending(false);
				// setPersonalInfo(values);
				setViewMode(true);
				Modal.success({
					title: 'Success',
					content: 'Infomation updated.',
				})
			}, 1500)
		},
		[form],
	);

	const meta = {
		columns: 2,
		disabled: pending,
		fields: [
			{key: 'name', label: 'Name', required: true, initialValue: q.name},
			{key: 'loadBalancer', label: 'Loadbalancer', required: true, initialValue: q.loadBalancer}
		]
	};

	return (
		<Card>
			<Form layout="horizontal" onSubmit={handleSubmit}>
				<h1 style={{height: '40px', fontSize: '16px', marginTop: '50px', color: '#888'}}>
					{printQueue.name}
					{viewMode && (
						<Button type="link" onClick={() => setViewMode(false)} style={{float: 'right'}}>
							Edit
						</Button>
					)}
				</h1>
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
					</Form.Item>
				)}
			</Form>
		</Card>
	)
}

export default Form.create()(PQ)
