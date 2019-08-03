import React from "react";
import {MoreVert} from "@material-ui/icons";
import Menu from "@material-ui/core/Menu";
import styled from 'styled-components'

const MoreIconButton = styled.button`
 	background-color:#00000000;
 	padding:0px;
 	border:none;
`;

export function MoreMenu({children}) {
	const [anchorEl, setAnchorEl] = React.useState(null);

	function handleClick(event) {
		setAnchorEl(event.currentTarget);
	}

	function handleClose() {
		setAnchorEl(null);
	}

	return (
		<div>
			<MoreIconButton onClick={handleClick}><MoreVert/></MoreIconButton>
			<Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleClose}>
				{children}
			</Menu>
		</div>
	);
}
