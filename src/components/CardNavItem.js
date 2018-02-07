import React from 'react';
import { NavLink } from 'react-router-dom';

class CardNavItem extends React.Component {
	render() {
		return (
			<NavLink to={this.props.link} activeClassName="active">
				<li className={this.props.active ? 'active' : ''}>
					<div>{this.props.text}</div>
				</li>
			</NavLink>
		);
	}
}

export default CardNavItem;
