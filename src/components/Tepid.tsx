import React from 'react';

import { CTFerRoute, ElderRoute, UserRoute, GuestRoute } from './auth_routes';

import SignInPage from '../pages/SignInPage';
import DestinationsPage from '../pages/DestinationsPage';
import LogsPage from '../pages/LogsPage';
import QueuesPage from '../pages/QueuesPage';
import ConfigQueuesPage from '../pages/ConfigQueuesPage';
import MyAccountPage from '../pages/MyAccountPage';
import ConstitutionPage from '../pages/ConstitutionPage';
import StatisticsPage from '../pages/StatisticsPage';
import DashboardPage from '../pages/DashboardPage';
import AccountPage from '../pages/AccountPage';

class Tepid extends React.Component {
	render() {
		return (
			<div>
				<GuestRoute path="/sign-in" component={SignInPage} />
				<UserRoute exact path="/" component={DashboardPage} />
				<CTFerRoute path="/accounts" component={AccountPage} />
				<UserRoute path="/my-account" component={MyAccountPage} />
				<CTFerRoute path="/queues" component={QueuesPage} />
				<ElderRoute path="/config-queues" component={ConfigQueuesPage} />
				<ElderRoute path="/destinations" component={DestinationsPage} />
				<CTFerRoute path="/statistics" component={StatisticsPage} />
				<ElderRoute path="/logs" component={LogsPage} />
				<CTFerRoute path="/constitution" component={ConstitutionPage} />
			</div>
		);
	}
}

export default Tepid;
