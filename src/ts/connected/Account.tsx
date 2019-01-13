import Types from 'TepidTypes';
import {connect} from "react-redux";
import {Account} from "../components/Account";

const mapStateToProps = (state: Types.RootState) => ({
    displayName: "",
    user: null
});

export const AccountConnected = connect(mapStateToProps, {
    t: ""
})(Account);