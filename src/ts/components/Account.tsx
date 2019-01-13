import * as React from 'react';
import {User} from "../../api/models/user";

export interface AccountProps {
    user: User | null
    displayName: string
    setNickname: (nick: string) => void
    enableColor: (enable: boolean) => void
}

export const Account: React.FC<AccountProps> = props => {
    const {user, displayName, setNickname, enableColor} = props;

    return (
        <div>
            <span>Name: {displayName}</span>
            <button type="button" onClick={() => setNickname("test")}>
                Set nickname to test
            </button>
        </div>
    )
};