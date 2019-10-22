import React, {useEffect, useState} from 'react';
import {connect, useDispatch, useSelector} from "react-redux"
import {NavLink, withRouter} from 'react-router-dom';
import {AutoComplete, Menu} from 'antd';
import {fetchAutoSuggest, invalidateAuth} from "../actions";
import useMenu from "../hooks/useMenu";
import useDebounce from "../hooks/useDebounce";
import SubMenu from "antd/es/menu/SubMenu";

const {Option} = AutoComplete;

function renderSuggestion(s) {
	return (
		<Option key={s.shortUser} text={s.displayName}>
			{s.displayName}
		</Option>
	)
}

function HeaderSearchBar(props) {
	const dispatch = useDispatch();
	const suggestions = useSelector(state => state.ui.autosuggest);

	const [searchTarget, setSearchTarget] = useState("");

	function handleSelect(value) {
		props.history.push('/accounts/' + value)
	}

	function handleSubmit(e) {
		e.preventDefault();
		handleSelect(searchTarget);
	}

	const debouncedTarget = useDebounce(searchTarget, 500);
	useEffect(
		() => {
			dispatch(fetchAutoSuggest(searchTarget));

		}, [debouncedTarget]
	);

	function handleChange(value) {
		setSearchTarget(value)
	}

	return (
		<div className="header-left">
			<form onSubmit={handleSubmit}>
				<i className="material-icons">search</i>

				<AutoComplete
					onSearch={handleChange}
					dataSource={suggestions.map(renderSuggestion)}
					onSelect={handleSelect}
					placeholder={"Search for users..."}
					optionLabelProp="text"
				/>
			</form>
		</div>
	)
}

const mapStateToProps = state => {
	return {auth: state.auth}
};

function PageHeaderContent(props) {
	const dispatch = useDispatch();

	const menu = useMenu();

	const handleSignOut = () => {
		menu.handleClose();
		dispatch(invalidateAuth());
	};

	return (
		<header style={{}}>
			{(props.auth.user.role === "ctfer" || props.auth.user.role === "elder") && (
				<HeaderSearchBar history={props.history}/>
			)}

			<Menu mode={"inline"} style={{maxWidth: "40vw", width: "20%", minWidth: "200px"}}>
				<SubMenu
					key="account"
					title={
						<>
							{props.auth.user.displayName}
						</>
					}
				>
					<Menu.Item><NavLink to="/my-account">My Account</NavLink></Menu.Item>
					<Menu.Item onClick={handleSignOut}>Sign Out</Menu.Item>
				</SubMenu>
			</Menu>
		</header>
	);
}

const PageHeader = withRouter(connect(mapStateToProps)(PageHeaderContent));

export default PageHeader;
