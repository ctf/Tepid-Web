import React from 'react';

import { NavLink } from 'react-router-dom';

class TepidSidebar extends React.Component {
	render() {
		return (
			<aside>
				<nav>
					<h1>
						<img src="/images/logo_white.svg" alt="TEPID Logo" />
						TEPID
					</h1>
					<ul>
						<li>
							<NavLink exact to="/" activeClassName="active">
								<i className="material-icons">show_chart</i> Dashboard
							</NavLink>
						</li>

						<hr />

						<li>
							<NavLink to="/accounts" activeClassName="active">
								<i className="material-icons">search</i> User Lookup
							</NavLink>
						</li>
						<li>
							<NavLink to="/my-account" activeClassName="active">
								<i className="material-icons">person</i> My Profile
							</NavLink>
						</li>

						<hr />

						<li>
							<NavLink to="/queues" activeClassName="active">
								<i className="material-icons">view_list</i> Queues
							</NavLink>
						</li>
						<li>
							<NavLink to={"/config-queues"} activeClassName="active">
								<i className="material-icons">settings</i> Queue Configuration
							</NavLink>
						</li>
						<li>
							<NavLink to={"/config-destinations"} activeClassName="active">
								<i className="material-icons">settings</i> Destination Configuration
							</NavLink>
						</li>
						<li>
							<NavLink to="/destinations" activeClassName="active">
								<i className="material-icons">print</i> Destinations
							</NavLink>
						</li>

						<hr />

						<li>
							<NavLink to="/statistics" activeClassName="active">
								<i className="material-icons">multiline_chart</i> Statistics
							</NavLink>
						</li>
						<li>
							<NavLink to="/logs" activeClassName="active">
								<i className="material-icons">bug_report</i> Logs
							</NavLink>
						</li>

						<hr />

						<li><i className="material-icons">library_books</i> Wiki</li>
						<li>
							<NavLink to="/constitution" activeClassName="active">
								<i className="material-icons">description</i> Consitution
							</NavLink>
						</li>

						<hr />

						<li><i className="material-icons">file_download</i> Download TEPID Client</li>
					</ul>
				</nav>
			</aside>
		);
	}
}

export default TepidSidebar;
