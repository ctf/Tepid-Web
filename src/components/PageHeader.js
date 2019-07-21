import React from 'react';
import {connect} from "react-redux"
import {NavLink} from 'react-router-dom';


const mapStateToProps = state => {
    return {auth: state.auth}
};

const PageHeaderContent = ({auth})=> {
    return (
        <header>
            { (auth.user.role === "ctfer" || auth.user.role === "elder") && (
            <div className="header-left">
                <i className="material-icons">search</i>
                <input type="text" name="user-search" id="header-user-search" placeholder="Search for users..."/>
            </div>)}
            <div className="header-right">
                <div id="header-user-dropdown">
                    {auth.user.displayName}
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

const PageHeader = connect(mapStateToProps)(PageHeaderContent);

export default PageHeader;
