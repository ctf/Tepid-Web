import React from 'react';

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

class Account extends React.Component {

	componentWillMount() {
		this.props.fetchNeededData(this.props.shortUser);
	}

	render() {
		if (!this.props.account || !this.props.account.data.type) {
			return (
				NoUserCard()
			)
		}
		const account = this.props.account.data;

		const quota = this.props.account.quota.amount;
		const maxQuota = 4000; // TODO: Fetch from somewhere

		const role = account.role;
		const canPrint = role === "user" || role === "ctfer" || role === "elder";
		const isVolunteer = role === "ctfer" || role === "elder";
		const paidFund = account.groups.reduce((acc, it)=>acc || it.name ==='000-21st Century Fund', false);
		const isExchangeStudent = canPrint && !paidFund;

		const permissionIsVolunteer = this.props.auth.role === "ctfer" || this.props.auth.role === "elder";
		const permissionCanSetExchange = this.props.auth.role === "ctfer" || this.props.auth.role === "elder";

		const self = Object.keys(this.props.auth.user).includes('shortUser')
			? account.shortUser === this.props.auth.user.shortUser
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
		if (isVolunteer) { badgeables.push('CTF Volunteer')}
		if (isExchangeStudent) {badgeables.push('Exchange')}
		if (account.shortUser === this.props.auth.user.shortUser) {badgeables.push('You!')}

		const badges = this.props.account === undefined
			? ''
			: badgeables.map(badge => (<div className="badge" key={badge}>{badge}</div>));

		const jobs = (this.props.account === undefined || this.props.jobs.isFetching) ? [] : this.props.account.jobs.items.map(it => this.props.jobs.items[it]);
		const jobTable = canPrint ? (
			<JobTable loading={jobs.length === 0} jobs={jobs} showUser={false} canRefund={permissionIsVolunteer}/>) : '';

		const handleSetColorPrinting = (e) => {
			this.props.setColorPrinting(account.shortUser, e.target.checked)
		};

		const handleSetExchange = (e) => {
			this.props.setExchangeStatus(account.shortUser, e.target.checked)
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
						{canPrint ? (
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
						) : ''}
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
									<ToggleExchangeSwitch value={isExchangeStudent} onChange={handleSetExchange} disabled={!permissionCanSetExchange}/>
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
}

export default Account;
