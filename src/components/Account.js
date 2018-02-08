import React from 'react';

import JobTable from './JobTable';

class Account extends React.Component {
	componentDidMount() {
		this.props.fetchNeededData(this.props.shortUser);
	}

	componentWillReceiveProps(nextProps, nextContext) {
		this.props.fetchNeededData(nextProps.shortUser);
	}
	render() {
		if (this.props.account === undefined) {
			return (<div><div className="card">Loading...</div></div>);
		}

		const account = this.props.account.data;

		const canPrint = true; // TODO: Exchange/paid into fund/CTF volunteer

		const self = Object.keys(this.props.auth.user).includes('shortUser')
			? this.props.account.data.shortUser === this.props.auth.user.shortUser
			: false;

		const facultyOrDepartment = (() => {
			if (!account.staff && account.faculty) {
				return account.faculty;
			} else if(account.staff && account.department) {
				return account.department;
			} else {
				return ''
			}
		})();

		const salutation = self
			? (account.salutation ? account.salutation : account.displayName)
			: account.displayName;

		const badges = ['CTF Volunteer'].map(badge => (<div className="badge" key={badge}>{badge}</div>));

		const jobs = this.props.account.jobs;
		const jobTable = jobs.length > 0 && canPrint ? (<JobTable jobs={jobs} />) : '';

		return (
			<div>
				<div className="card no-padding">
					<div className="user-profile">
						<div className="row">
							<div className="col no-padding no-borders">
								<h2>{salutation} {badges}</h2>
							</div>
							<div className="col no-padding no-borders">
								<div className="faculty">{facultyOrDepartment}</div>
							</div>
						</div>
						<div className="flex-row-container">
							<div className="quota-label">Quota</div>
							<div className="quota-bar">
								<div className="quota-inner-bar" style={{width: '69.3%'}}>2772 pages remaining</div>
							</div>
						</div>
						<hr />
						<div className="user-profile-details">
							<div className="row">
								<div className="col">
									<strong>Short Username:</strong> {account.shortUser} <br />
									<strong>Long Username:</strong> {account.longUser} <br />
									<strong>ID:</strong> <a href="">Click to show...</a> <br />
									<strong>Current Status:</strong> Active <br />
									<strong>Student Since:</strong> May 2015 <br />
									User <strong>has</strong> paid into the 21st Century Fund
								</div>
								<div className="col">
									<strong>Preferred Salutation:</strong> <br />
									<input type="text" value="David" style={{marginBottom: '0.6rem'}} /> <br />
									<strong>Jobs Expire After:</strong> 1 Week <br />
									<strong>Colour Printing:</strong> {account.colorPrinting ? 'On' : 'Off'}
								</div>
							</div>
						</div>
					</div>
				</div>

				<div className="card no-padding">
					{jobTable}
				</div>
			</div>
		);
	}
}

export default Account;
