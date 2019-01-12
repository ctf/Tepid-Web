import * as printJobActions from "./actions/printjobs";
import * as authActions from "./actions/auth";


const api = {
    ...printJobActions,
    ...authActions
};

export default api;