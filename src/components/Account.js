import React, {useEffect} from 'react';

import JobTable from './JobTable';
import Switch from "@material-ui/core/Switch";
import {FormControlLabel} from "@material-ui/core";

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

function ToggleColorSwitch({value, onChange, ...rest}) {
	return (
		<div>
			<FormControlLabel control={<Switch checked={value} onChange={onChange}/>} label={"Colour Printing"}
							  labelPlacement="end" {...rest}/>
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

function Account(props) {

	useEffect(() => {
		props.fetchNeededData(props.shortUser);
	}, [props.shortUser]);


	if (!props.account || !props.account.data.type) {
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

	const handleSetColorPrinting = (e) => {
		props.setColorPrinting(account.shortUser, e.target.checked)
	};

	const handleSetExchange = (e) => {
		props.setExchangeStatus(account.shortUser, e.target.checked)
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
								<strong>Preferred Salutation:</strong> <br/>
								<input type="text" value="David" style={{marginBottom: '0.6rem'}}/> <br/>
								<strong>Jobs Expire After:</strong> 1 Week <br/>
								<ToggleColorSwitch value={account.colorPrinting}
												   onChange={handleSetColorPrinting}/>
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
