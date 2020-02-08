import {FormComponentProps} from "antd/es/form";
import {Semester} from "../models";
import React, {useCallback, useState} from "react";
import {useDispatch} from "react-redux";
import * as actions from "../actions";
import {Button, Card, Form, Modal} from "antd";
import FormBuilder from 'antd-form-builder'


interface SemesterArgs extends FormComponentProps {
	shortUser: string,
	semester: Semester,
	isNew: boolean,
}

export const semesterFormMeta = (s) => ({
	columns: 2,
	fields: [
		{key: 'year', label: 'Year', required: true, initialValue: s.year},
		{key: 'season', label: 'Season', required: true, initialValue: s.season},
	]
});

function InnerSemester({form, shortUser, semester, isNew = false}: SemesterArgs) {
	const [s, ss] = useState(semester);

	const dispatch = useDispatch();

	const [viewMode, setViewMode] = useState(!isNew);
	const [pending, setPending] = useState(false);

	const handleUpdate = useCallback(
		evt => {
			evt.preventDefault();
			const values = form.getFieldsValue();
			console.log('Submit: ', values);
			setPending(true);
			const n = Object.assign({}, s, values);
			ss(n);
			dispatch(actions.doAddSemester(shortUser, n)).then(
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
			setViewMode(true);
			dispatch(actions.doRemoveSemester(shortUser, semester)).then(
				() => {
					setPending(false);
					setViewMode(true);
					Modal.success({
						title: 'Success',
						content: 'Deleted.',
					})
				})
		},
		[form]
	);

	const meta = semesterFormMeta(s);

	return (
		<Card >
			<Form layout="horizontal" onSubmit={handleUpdate}>
				<FormBuilder form={form} meta={{...meta, disabled: pending}} viewMode={viewMode}/>
				{!viewMode && (
					<Form.Item className="form-footer" wrapperCol={{span: 16, offset: 4}}>
						<Button htmlType="submit" type="primary" disabled={pending}>
							{pending ? 'Updating...' : 'Update'}
						</Button>
						<Button onClick={() => {
							form.resetFields();
							setViewMode(true)
						}}>
							Cancel
						</Button>
					</Form.Item>
				)}
			</Form>
			{!isNew && (
				<Button type="danger" onClick={handleDelete}> Delete </Button>
			)}
		</Card>
	)
}

export default Form.create()(InnerSemester)
