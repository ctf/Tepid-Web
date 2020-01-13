import React, {useCallback, useState} from "react";
import {Card, Form, Input} from "antd";
import {useDispatch} from "react-redux";
import {PrintQueue} from "../models";
import {FormComponentProps} from 'antd/lib/form/Form';

interface i extends FormComponentProps {
	pq: PrintQueue
}

function _PrintQueueCard(props: i) {

	const {getFieldDecorator, getFieldValue} = props.form;
	const [q, sq] = useState(props.pq);

	const dispatch = useDispatch();

	const [pending, setPending] = useState(false)
	const handleSubmit = useCallback(
		evt => {
			evt.preventDefault()
			const values = form.getFieldsValue()
			console.log('Submit: ', values)
			setPending(true)
			setTimeout(() => {
				setPending(false)
				setPersonalInfo(values)
				setViewMode(true)
				Modal.success({
					title: 'Success',
					content: 'Infomation updated.',
				})
			}, 1500)
		},
		[form],
	)

	const meta = {
		columns: 2,
		disabled: pending,
		fields: [
			{label: 'Name', required: true, initialValue: q.name}
		]
	};

	return (
		<Form layout="horizontal" onSubmit={handleSubmit}>

		</Form>
	)
}

const PrintQueueCard = (p: PrintQueue) => Form.create({
	name: 'PrintQueueCard',
})(_PrintQueueCard);

export default PrintQueueCard