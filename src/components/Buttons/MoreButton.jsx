import React from "react";
import {MoreVert} from "@material-ui/icons";
import {Dropdown, Menu} from "antd";

export function MoreMenu({children}) {
	return (
		<Dropdown overlay={
			<Menu>
				{children}
			</Menu>
		}>
			<MoreVert/>
		</Dropdown>
	);
}
