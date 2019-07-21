import React, {useState} from 'react';
import {connect} from "react-redux"
import {NavLink, Redirect, withRouter} from 'react-router-dom';


function HeaderSearchBar(props){

    const [searchTarget, setSearchTarget] = useState("");

    function handleSubmit(event){
        event.preventDefault();
        props.history.push('/accounts/'+searchTarget)
    }

    function handleChange(event) {
        setSearchTarget(event.target.value);
    }

    return (
        <div className="header-left">
            <form onSubmit={handleSubmit}>
            <i className="material-icons">search</i>
            <input type="text" name="user-search" id="header-user-search" placeholder="Search for users..." value ={searchTarget} onChange={handleChange}/>
            </form>
        </div>
    )
}

const mapStateToProps = state => {
    return {auth: state.auth}
};

const PageHeaderContent = (props)=> {
    return (
        <header>
            { (props.auth.user.role === "ctfer" || props.auth.user.role === "elder") && (
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
