import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';

import {fetchAccountAndRelatedDataIfNeeded} from '../actions';

import Account from '../components/Account';

const mapStateToProps = (state, ownProps) => ({
	auth: state.auth,
	shortUser: ownProps.match.params.shortUser
		? ownProps.match.params.shortUser
		: ownProps.shortUser,
	account: state.accounts.items[ownProps.match.params.shortUser
		? ownProps.match.params.shortUser
		: ownProps.shortUser]
});

const mapDispatchToProps = (dispatch, ownProps) => ({
	fetchNeededData: (shortUser) => {
		dispatch(fetchAccountAndRelatedDataIfNeeded(shortUser));
	}
});

const AccountContainer = withRouter(connect(mapStateToProps, mapDispatchToProps)(Account));

export default AccountContainer;
