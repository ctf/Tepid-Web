import React, {useEffect, useState} from 'react';

import JobTable from './JobTable';
import Switch from "@material-ui/core/Switch";
import {FormControlLabel} from "@material-ui/core";
import {DebounceInput} from "react-debounce-input";
import useModal from "../hooks/useModal";
import Dialog from "@material-ui/core/es/Dialog/Dialog";
import DialogTitle from "@material-ui/core/es/DialogTitle/DialogTitle";
import DialogContent from "@material-ui/core/es/DialogContent/DialogContent";
import DialogActions from "@material-ui/core/es/DialogActions/DialogActions";
import Button from "@material-ui/core/es/Button/Button";

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

function ToggleColorSwitch({value, setColourPrinting, ...rest}) {
	const confirmModal = useModal();

	const handleClick = () =>{
		setColourPrinting(!value);
		confirmModal.handleClose();
    };

	return (
		<div>
			<FormControlLabel control={<Switch checked={value} onChange={confirmModal.handleOpen}/>} label={"Colour Printing"}
							  labelPlacement="end" {...rest}/>
			<Dialog
				open={confirmModal.open}
				onClose={confirmModal.handleClose}>
				<DialogTitle>Confirm Color Printing Activation</DialogTitle>
				<DialogContent>
					For every page of color that is printed, 3 pages of your quota is used up. If you accidentally print in color, you will not be refunded for the pages you printed.
				</DialogContent>
				<DialogActions>
					<Button variant={"outlined"} onClick={handleClick}>Confirm</Button>
				</DialogActions>
			</Dialog>
		</div>
	)
}

function ToggleExchangeSwitch({value, onChange, ...rest}) {
	return (
		<div>
			<FormControlLabel control={<Switch checked={value} onChange={onChange}/>} label={'Exchange Student'}
							  labelPlacement="end" {...rest}/>
		</div>
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
	useEffect(()=>{
		setNick(initialValue)
	},[initialValue]);

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

function Account(props) {

	useEffect(() => {
		props.fetchNeededData(props.shortUser);
	}, [props.shortUser]);


	if (!props.account || !props.account.data._id) {
		return (
			NoUserCard()
		)
	}
	const account = props.account.data;

	const quota = props.account.quota.amount;
	const maxQuota = 4000; // TODO: Fetch from somewhere

	const role = account.role;
	const canPrint = role === "user" || role === "ctfer" || role === "elder";
	const isVolunteer = role === "ctfer" || role === "elder";
	const paidFund = account.groups.reduce((acc, it) => acc || it.name === '000-21st Century Fund', false);
	const isExchangeStudent = canPrint && !paidFund;

	const permissionIsVolunteer = props.auth.role === "ctfer" || props.auth.role === "elder";
	const permissionCanSetExchange = props.auth.role === "ctfer" || props.auth.role === "elder";

	const self = Object.keys(props.auth.user).includes('shortUser')
		? account.shortUser === props.auth.user.shortUser
		: false;

	const facultyOrDepartment = (() => {
		if (!account.staff && account.faculty) {
			return account.faculty;
		} else if (account.staff && account.department) {
			return account.department;
		} else {
			return ''
		}
	})();

	const salutation = self
		? (account.salutation ? account.salutation : account.displayName)
		: account.displayName;

	const badgeables = [];
	if (isVolunteer) {
		badgeables.push('CTF Volunteer')
	}
	if (isExchangeStudent) {
		badgeables.push('Exchange')
	}
	if (account.shortUser === props.auth.user.shortUser) {
		badgeables.push('You!')
	}

	const badges = props.account === undefined
		? ''
		: badgeables.map(badge => (<div className="badge" key={badge}>{badge}</div>));

	const jobs = (props.account === undefined || props.jobs.isFetching) ? [] : props.account.jobs.items.map(it => props.jobs.items[it]);
	const jobTable = canPrint ? (
		<JobTable loading={jobs.length === 0} jobs={jobs} showUser={false} canRefund={permissionIsVolunteer}/>) : '';

	const handleSetColorPrinting = (colorEnabled) => {
		props.setColorPrinting(account.shortUser, colorEnabled)
	};

	const handleSetExchange = (e) => {
		props.setExchangeStatus(account.shortUser, e.target.checked)
	};

	const handleSetNick = (e) => {
		props.setNick(account.shortUser, e.target.value);
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
								<strong>Short Username:</strong> {account.shortUser} <br/>
								<strong>Long Username:</strong> {account.longUser} <br/>
								<strong>Current Status:</strong> Active <br/>
								<strong>Student Since:</strong> May 2015 <br/>
								User <strong>has {paidFund ? '' : 'not '}</strong>paid into the 21st Century Fund
							</div>
							<div className="col">
								<NickSetter initialValue={account.nick}
											placeHolder={account.salutation}
												  onChange={handleSetNick}/>
								<strong>Jobs Expire After:</strong> 1 Week <br/>
								<ToggleColorSwitch value={account.colorPrinting}
                                                   setColourPrinting={handleSetColorPrinting}/>
								<ToggleExchangeSwitch value={isExchangeStudent} onChange={handleSetExchange}
													  disabled={!permissionCanSetExchange}/>
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
