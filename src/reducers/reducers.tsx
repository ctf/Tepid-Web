import {State} from "./state";
import {TepidAction} from "./actions";


export default (state: State, action: TepidAction): string => {
    switch (action) {
        case TepidAction.LoginAction:
            return {}
    }
}