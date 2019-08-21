import React, {useState} from 'react';
import {connect, useDispatch, useSelector} from "react-redux"
import {NavLink, Redirect, withRouter} from 'react-router-dom';
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";
import {invalidateAuth} from "../actions";
import Button from "@material-ui/core/Button";
import useMenu from "../hooks/useMenu";
import {fetchAutoSuggest} from "../actions";
import Autosuggest from 'react-autosuggest';
import Paper from "@material-ui/core/Paper";


function renderSuggestion(s, {isHighlighted}) {
	return <MenuItem selected={isHighlighted} component={"div"}>
		<div>{s.displayName}</div>
	</MenuItem>
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
						id: "header-user-search",
						placeholder: "Search for users...",
						value: searchTarget,
						onChange: (event, {newValue}) => {
							setSearchTarget(newValue)
						},
					}}
					theme={{
						suggestionsList: {
							margin: 0,
							padding: 0,
							listStyleType: 'none',
						},
						suggestionsContainer:{
							width: '95%',
						}
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

function PageHeaderContent (props) {
    const dispatch = useDispatch();

    const menu = useMenu();

    const handleSignOut = ()=>{
        dispatch(invalidateAuth());
    };

    return (
        <header>
            { (props.auth.user.role === "ctfer" || props.auth.user.role === "elder") && (
                <HeaderSearchBar history={props.history}/>
            )}
            <div className="header-right">
                <Button id="header-user-dropdown" onClick={menu.handleOpen}>
                    {props.auth.user.displayName}
                    <i className="material-icons">keyboard_arrow_down</i>
                    <Menu open={menu.open} anchorEl={menu.anchorEl} onClose={menu.handleClose}>
                        <MenuItem><NavLink to="/my-account">My Account</NavLink></MenuItem>
                        <MenuItem onClick={handleSignOut}>Sign Out</MenuItem>
                    </Menu>
                </Button>
            </div>
        </header>
    );
};

const PageHeader = withRouter(connect(mapStateToProps)(PageHeaderContent));

export default PageHeader;
