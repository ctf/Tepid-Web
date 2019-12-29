import React, {useEffect, useState} from 'react';

import JobTable from './JobTable';
import {DebounceInput} from "react-debounce-input";
import useModal from "../hooks/useModal";
import {Button, Form, Modal, Switch} from "antd";

function NoUserCard() {
	return (
		<div>
			<div className="card no-padding">
				<div className="user-profile">
					<div className="row">
						<div className="col no-padding no-borders">
							<h2> Could not find user</h2>
						</div>
					</div>
				</div>
			</div>
		</div>
	)
}

function ToggleColorSwitch({value, setColourPrinting}) {
	const confirmModal = useModal();

	const confirmModalAppear = () => {
		if (!value) {
			confirmModal.handleOpen();
		} else {
			setColourPrinting(!value);
		}
	};

	const handleClick = () => {
		setColourPrinting(!value);
		confirmModal.handleClose();
	};

	return (
		<>
			<Modal title={'Confirm Color Printing Activation'} visible={confirmModal.open}
				   footer={[
					   <Button type={"primary"} onClick={handleClick}>Confirm</Button>]}>
				For every page of color that is printed, 3 pages of your quota is used up. If you accidentally print in
				color, you will not be refunded for the pages you printed.
			</Modal>

			<Form.Item label={"Colour Printing"}>
				<Switch checked={value} onChange={confirmModalAppear}/>
			</Form.Item>
		</>
	)
}

function ToggleExchangeSwitch({value, onChange, disabled}) {
	return (
		<Form.Item label={"Exchange Student"}>
			<Switch checked={value} onChange={onChange} disabled={disabled}/>
		</Form.Item>
	)
}

function QuotaBar({quota, maxQuota}) {
	return (
		<div>
			<div className="flex-row-container">
				<div className="quota-label">Quota</div>
				<div className={'quota-bar' + (quota === null ? ' loading' : '')}>
					<div className="quota-inner-bar"
						 style={{width: `${quota / maxQuota * 100}%`}}>
						<strong>{quota}</strong> pages remaining
					</div>
				</div>
			</div>
			<hr/>
		</div>
	)
}

function NickSetter({initialValue, placeHolder, onChange}) {
	const [nick, setNick] = useState(initialValue);
	useEffect(() => {
		setNick(initialValue)
	}, [initialValue]);

	const handleChange = (e) => {
		setNick(e.target.value);
		onChange(e);
	};

	return (
		<>
			<strong>Preferred Salutation:</strong> <br/>
			<DebounceInput
				type="text"
				debounceTimeout={200}
				placeHolder={placeHolder}
				value={nick}
				onChange={handleChange}
				style={{marginBottom: '0.6rem'}}/> <br/>
		</>
	)
}

function Account({shortUser, account, jobs, auth, fetchNeededData, setColorPrinting, setExchangeStatus, setNick}) {

	useEffect(() => {
		fetchNeededData(shortUser);
	}, [shortUser]);


	if (!account || !account.data._id) {
		return (
			NoUserCard()
		)
	}
	const accountData = account.data;

	const quota = account.quota.amount;
	const maxQuota = account.quota.max;

	const role = accountData.role;
	const canPrint = maxQuota > 0;
	const isVolunteer = role === "ctfer" || role === "elder";
	const paidFund = accountData.groups.reduce((acc, it) => acc || it.name === '000-21st Century Fund', false);
	const isExchangeStudent = canPrint && !paidFund;

	const permissionIsVolunteer = auth.role === "ctfer" || auth.role === "elder";
	const permissionCanSetExchange = auth.role === "ctfer" || auth.role === "elder";

	const self = Object.keys(auth.user).includes('shortUser')
		? accountData.shortUser === auth.user.shortUser
		: false;

	const facultyOrDepartment = (() => {
		if (!accountData.staff && accountData.faculty) {
			return accountData.faculty;
		} else if (accountData.staff && accountData.department) {
			return accountData.department;
		} else {
			return ''
		}
	})();

	const salutation = self
		? (accountData.salutation ? accountData.salutation : accountData.displayName)
		: accountData.displayName;

	const badgeables: string[] = [];
	if (isVolunteer) {
		badgeables.push('CTF Volunteer')
	}
	if (isExchangeStudent) {
		badgeables.push('Exchange')
	}
	if (accountData.shortUser === auth.user.shortUser) {
		badgeables.push('You!')
	}

	const badges = account === undefined
		? ''
		: badgeables.map(badge => (<div className="badge" key={badge}>{badge}</div>));

	const jobsElements = (account === undefined || jobs.isFetching) ? [] : account.jobs.items.map(it => jobs.items[it]);
	const jobTable = canPrint ? (
		<JobTable loading={jobsElements.length === 0} jobs={jobsElements} showUser={false} canRefund={permissionIsVolunteer}/>) : '';

	const handleSetColorPrinting = (colorEnabled) => {
		setColorPrinting(accountData.shortUser, colorEnabled)
	};

	const handleSetExchange = (value) => {
		setExchangeStatus(accountData.shortUser, value)
	};

	const handleSetNick = (e) => {
		setNick(accountData.shortUser, e.target.value);
	};

	return (
		<div>
			<div className="card no-padding">
				<div className="user-profile">
					<div className="row">
						<div className="col no-padding no-borders">
							<h2>{salutation} {badges}</h2>
						</div>
						<div className="col no-padding no-borders">
							<div className="fac-dept">{facultyOrDepartment}</div>
						</div>
					</div>
					{canPrint ? <QuotaBar quota={quota} maxQuota={maxQuota}/> : ''}
					<div className="user-profile-details">
						<div className="row">
							<div className="col">
								<strong>Short Username:</strong> {accountData.shortUser} <br/>
								<strong>Long Username:</strong> {accountData.longUser} <br/>
								<strong>Current Status:</strong> Active <br/>
								<strong>Student Since:</strong> May 2015 <br/>
								User <strong>has {paidFund ? '' : 'not '}</strong>paid into the 21st Century Fund
							</div>
							<div className="col">
								<Form layout={"inline"}>
									<NickSetter initialValue={accountData.nick}
												placeHolder={accountData.salutation}
												onChange={handleSetNick}/>
									<strong>Jobs Expire After:</strong> 1 Week <br/>
									<ToggleColorSwitch value={accountData.colorPrinting}
													   setColourPrinting={handleSetColorPrinting}/>
									<ToggleExchangeSwitch value={isExchangeStudent} onChange={handleSetExchange}
														  disabled={!permissionCanSetExchange}/>
								</Form>
							</div>
						</div>
					</div>
					<hr/>

					<h3>Jobs</h3>
					{jobTable}
				</div>
			</div>
		</div>
	);
}

export default Account;
