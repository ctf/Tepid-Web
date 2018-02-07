import React from "react";

class PageHeader extends React.Component {
	render() {
		return (
			<header>
				<div className="header-left">
					<i className="material-icons">search</i>
					<input type="text" name="user-search" id="header-user-search" placeholder="Search for users..." />
				</div>
				<div className="header-right">
					<span id="header-user-dropdown">
						David Lougheed
						<i className="material-icons">keyboard_arrow_down</i>
					</span>
				</div>
			</header>
		);
	}
}

export default PageHeader;
