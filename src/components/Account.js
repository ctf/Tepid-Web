import React from 'react';

import JobTable from './JobTable';

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

class Account extends React.Component {
	componentDidMount() {
		this.props.fetchNeededData(this.props.shortUser);
	}

	componentWillReceiveProps(nextProps, nextContext) {
		this.props.fetchNeededData(nextProps.shortUser);
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

		const canPrint = true; // TODO: Exchange/paid into fund/CTF volunteer

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

		const badges = this.props.account === undefined
			? ''
			: ['CTF Volunteer'].map(badge => (<div className="badge" key={badge}>{badge}</div>));

		const jobs = this.props.account === undefined ? [] : this.props.account.jobs.items;
		const jobTable = canPrint ? (<JobTable loading={jobs.length === 0} jobs={jobs} showUser={false}/>) : '';

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
									User <strong>has</strong> paid into the 21st Century Fund
								</div>
								<div className="col">
									<strong>Preferred Salutation:</strong> <br/>
									<input type="text" value="David" style={{marginBottom: '0.6rem'}}/> <br/>
									<strong>Jobs Expire After:</strong> 1 Week <br/>
									<strong>Colour Printing:</strong> {account.colorPrinting ? 'On' : 'Off'}
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
