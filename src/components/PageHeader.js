import React, {useState} from 'react';
import {connect, useDispatch, useSelector} from "react-redux"
import {NavLink, withRouter} from 'react-router-dom';
import {fetchAutoSuggest} from "../actions";
import MenuItem from "@material-ui/core/MenuItem";
import Autosuggest from 'react-autosuggest';
import Paper from "@material-ui/core/Paper";


function renderSuggestion(s, { query, isHighlighted }) {
	return <MenuItem selected={isHighlighted} component={"div"}>{s.displayName}</MenuItem>
}

function HeaderSearchBar(props) {
	const dispatch = useDispatch();
	const suggestions = useSelector(state => state.ui.autosuggest);

	const [searchTarget, setSearchTarget] = useState("");
	const [reqID, setReqID] = useState(null);

	function handleSubmit(event) {
		event.preventDefault();
		props.history.push('/accounts/' + searchTarget)
	}

	async function handleChange({value}) {
		if (reqID !== null) {
			clearTimeout(reqID)
		}

		setReqID(
			setTimeout(() => {
				dispatch(fetchAutoSuggest(value))
			}, 1000)
		);
	}

	return (
		<div className="header-left">
			<form onSubmit={handleSubmit}>
				<i className="material-icons">search</i>

				<Autosuggest
					value={searchTarget}
					onSuggestionsFetchRequested={handleChange}
					onSuggestionsClearRequested={() => null}
					suggestions={suggestions}
					getSuggestionValue={s => s.shortUser}
					renderSuggestion={renderSuggestion}
					inputProps={{
						placeholder: "Search for users...",
						value: searchTarget,
						onChange: (event, {newValue}) => {
							setSearchTarget(newValue)
						},
					}}
					renderSuggestionsContainer={options => (
						<Paper {...options.containerProps} square>
							{options.children}
						</Paper>
					)}
				/>
			</form>
		</div>
	)
}

const mapStateToProps = state => {
	return {auth: state.auth}
};

const PageHeaderContent = (props) => {
	return (
		<header>
			{(props.auth.user.role === "ctfer" || props.auth.user.role === "elder") && (
				<HeaderSearchBar history={props.history}/>
			)}
			<div className="header-right">
				<div id="header-user-dropdown">
					{props.auth.user.displayName}
					<i className="material-icons">keyboard_arrow_down</i>
					<ul>
						<li><NavLink to="/my-account">My Account</NavLink></li>
						<li>Sign Out</li>
					</ul>
				</div>
			</div>
		</header>
	);
};

const PageHeader = withRouter(connect(mapStateToProps)(PageHeaderContent));

export default PageHeader;
