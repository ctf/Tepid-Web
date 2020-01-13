import TepidSidebar from "../components/TepidSidebar";
import PageHeader from "../components/PageHeader";
import {CTFerRoute, ElderRoute} from "../components/auth_routes";
import {withRouter} from 'react-router-dom';
import React from "react";
import ConfigQueuesContainer from "../containers/ConfigQueuesContainer"

function ConfigQueuesPage({match}) {
	return (
		<div>
			<TepidSidebar/>
			<main>
				<PageHeader/>
				<section id="page-content">
					<ElderRoute path={`${match.url}`} component={ConfigQueuesContainer}/>
				</section>
			</main>
		</div>
	);
}

export default withRouter(ConfigQueuesPage)