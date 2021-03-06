import React, {useEffect, useState} from 'react';
import {connect, useDispatch, useSelector} from "react-redux"
import {NavLink, withRouter} from 'react-router-dom';
import {AutoComplete, Dropdown, Icon, Menu} from 'antd';
import {fetchAutoSuggest, invalidateAuth} from "../actions";
import useMenu from "../hooks/useMenu";
import useDebounce from "../hooks/useDebounce";

const {Option} = AutoComplete;

function renderSuggestion(s) {
	return (
		<Option key={s.shortUser}>
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
			if (searchTarget !== null && searchTarget !== "") dispatch(fetchAutoSuggest(searchTarget));

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
					dataSource={suggestions ? suggestions.map(renderSuggestion) : []}
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

			<Dropdown overlay={
				<Menu>
					<Menu.Item><NavLink to="/my-account">My Account</NavLink></Menu.Item>
					<Menu.Item onClick={handleSignOut}>Sign Out</Menu.Item>
				</Menu>
			} trigger={["click"]}>
				<a className="ant-dropdown-link"
				   href="#"
				   style={{color: "#555", lineHeight: "32px", marginLeft: "24px"}}>
					{props.auth.user.displayName} <Icon type="down" />
				</a>
			</Dropdown>
		</header>
	);
}

const PageHeader = withRouter(connect(mapStateToProps)(PageHeaderContent));

export default PageHeader;
