import TepidSidebar from "../components/TepidSidebar";
import PageHeader from "../components/PageHeader";
import {ElderRoute} from "../components/auth_routes";
import {withRouter} from 'react-router-dom';
import React from "react";
import ConfigDestinationsContainer from "../containers/ConfigDestinationsContainer";

function ConfigQueuesPage({match}) {
	return (
		<div>
			<TepidSidebar/>
			<main>
				<PageHeader/>
				<section id="page-content">
					<ElderRoute path={`${match.url}`} component={ConfigDestinationsContainer}/>
				</section>
			</main>
		</div>
	);
}

export default withRouter(ConfigQueuesPage)