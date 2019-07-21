import React, {useState} from 'react';
import {connect} from "react-redux"
import {NavLink} from 'react-router-dom';


function HeaderSearchBar(props){

    const [searchTarget, setSearchTarget] = useState("");

    function handleSubmit(event){
        alert(searchTarget.toString());
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

const PageHeaderContent = ({auth})=> {
    return (
        <header>
            { (auth.user.role === "ctfer" || auth.user.role === "elder") && (
                <HeaderSearchBar/>
            )}
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
