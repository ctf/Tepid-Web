import React from "react";

import styled from 'styled-components'

const PrinterUpIcon = styled.i`
	color: #4D983E
`;
const PrinterDownIcon = styled.i`
	color: #F44336;
`;

function PrinterIconHalf({up}) {
	return up ? <PrinterUpIcon className="material-icons"> print </PrinterUpIcon> :
		<PrinterDownIcon className="material-icons"> print </PrinterDownIcon>
}


export function QueueIcon({destinations}) {
	const hasUp = destinations.reduce((acc, it) => (acc || it.up), false);
	const allUp = destinations.reduce((acc, it) => (acc && it.up), true);

	return <div className="printer-status-display">
		<PrinterIconHalf up={allUp}/>
		<PrinterIconHalf up={hasUp}/>
	</div>;
}