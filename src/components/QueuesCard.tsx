import React from 'react';
import CardNav from './CardNav';

function QueuesCard({queues}) {
	const navItems = queues.map(queue => queue.name);
	// TODO: Loading
	return (
		<div className="card no-padding">
			<h2>
				Queues
				<CardNav navItems={navItems}/>
			</h2>
		</div>
	);
}

export default QueuesCard;
