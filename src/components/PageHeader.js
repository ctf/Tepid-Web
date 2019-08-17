import React, {useEffect, useState} from 'react';
import {connect, useDispatch} from "react-redux"
import {NavLink, Redirect, withRouter} from 'react-router-dom';
import {DebounceInput} from "react-debounce-input";
import {fetchAutoSuggest} from "../actions";


function HeaderSearchBar(props){
    const dispatch = useDispatch();

    const [searchTarget, setSearchTarget] = useState("");
    const [suggestions, setSuggestions] = useState([]);

    function handleSubmit(event){
        event.preventDefault();
        props.history.push('/accounts/'+searchTarget)
    }

    function handleChange(event) {
        setSearchTarget(event.target.value);
        console.log(event.target.value)
    }
    useEffect(()=> {
        const f = async() =>{
            if (searchTarget!=="") {
                console.log("DISPATCH");
                console.log(await dispatch(fetchAutoSuggest(searchTarget)));
            }
        };
        console.log(f());
        },[searchTarget]

    );


    return (
        <div className="header-left">
            <form onSubmit={handleSubmit}>
            <i className="material-icons">search</i>
            <DebounceInput type="text" name="user-search" id="header-user-search"
                           placeholder="Search for users..." value ={searchTarget}
                           onChange={handleChange}
                           minLength={2} debounceTimeout={300}
            />
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
