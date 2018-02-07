import React from 'react';

import CardNavItem from './CardNavItem';

class CardNav extends React.Component {
	render() {
		// noinspection JSUnresolvedVariable
		const navItems = this.props.navItems.map(nav => (
			<CardNavItem key={nav.text} text={nav.text} link={nav.link} />
		));
		return (
			<nav className="card-tabs">
				<ul>
					{navItems}
				</ul>
			</nav>
		);
	}
}

export default CardNav;
