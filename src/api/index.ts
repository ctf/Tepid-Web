import * as printJobActions from "./actions/printjob";
import * as authActions from "./actions/auth";


const api = {
    ...printJobActions,
    ...authActions
};

export default api;