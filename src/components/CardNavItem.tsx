import React from 'react';
import {NavLink} from 'react-router-dom';

function CardNavItem({key, text, link, active}) {
	return (
		<NavLink to={link} activeClassName="active">
			<li className={active ? 'active' : ''}>
				<div>{text}</div>
			</li>
		</NavLink>
	);
}

export default CardNavItem;
