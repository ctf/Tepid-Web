import React from 'react';

import CardNavItem from './CardNavItem';

function CardNav({navItems}) {
	const navItemElements = navItems.map(nav => (
		<CardNavItem key={nav.text} text={nav.text} link={nav.link} active={nav.active}/>
	));
	return (
		<nav className="card-tabs">
			<ul>
				{navItemElements}
			</ul>
		</nav>
	);
}

export default CardNav;
