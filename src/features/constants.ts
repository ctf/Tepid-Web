/**
 * Collection of all types used within redux.
 * While the enum names themselves can change, the associated values
 * should remain both unique and constant.
 */
export const enum TepidAction {
    // Login
    LoginRequest = "LOGIN_REQUEST",
    LoginSuccess = "LOGIN_SUCCESS",
    LoginFailure = "LOGIN_FAILURE",
    // Logout
    LogoutRequest = "LOGOUT_REQUEST",
    LogoutSuccess = "LOGOUT_SUCCESS",
    LogoutFailure = "LOGOUT_FAILURE",
    // User
    UserRequest = "USER_REQUEST",
    UserSuccess = "USER_SUCCESS",
    UserFailure = "USER_FAILURE",
    // Quota
    QuotaRequest = "QUOTA_REQUEST",
    QuotaSuccess = "QUOTA_SUCCESS",
    QuotaFailure = "QUOTA_FAILURE",
}