import React from 'react';
import {NavLink} from 'react-router-dom';

class PageHeader extends React.Component {
	render() {
		return (
			<header>
				<div className="header-left">
					<i className="material-icons">search</i>
					<input type="text" name="user-search" id="header-user-search" placeholder="Search for users..." />
				</div>
				<div className="header-right">
					<div id="header-user-dropdown">
						David Lougheed
						<i className="material-icons">keyboard_arrow_down</i>
						<ul>
							<li><NavLink to="/my-account">My Account</NavLink></li>
							<li>Sign Out</li>
						</ul>
					</div>
				</div>
			</header>
		);
	}
}

export default PageHeader;
