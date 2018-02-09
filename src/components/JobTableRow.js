import React from 'react';
import { Link } from 'react-router-dom';

import { jobStatus } from '../tepid-utils';

class JobTableRow extends React.Component {
	render() {
		return (
			<tr>
				{/*<td>{i++}</td>*/}
				<td>{this.props.job.started === -1 ? '' : new Date(this.props.job.started).toLocaleString('en-CA')}</td>
				{this.props.showUser ? (
					<td>
						<Link to={`/accounts/${this.props.job.userIdentification}`}>
							{this.props.job.userIdentification}
						</Link>
					</td>
				) : ''}
				<td>{`${this.props.job.pages} ${this.props.job.colorPages === 0 ? '' : ` (${this.props.job.colorPages} color)`}`}</td>
				<td>{jobStatus(this.props.job)}</td>
				<td>{this.props.job.originalHost}</td>
				<td>{this.props.job.name}</td>
				<td><i className="material-icons">more_vert</i></td>
			</tr>
		);
	}
}

export default JobTableRow;
