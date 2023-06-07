export const actionType = {
    SET_USER: 'SET_USER',
    SET_CAMPAIGNS: 'SET_CAMPAIGNS'
}

export default function reducer (state, action) {
    switch (action.type) {
        case actionType.SET_USER:
            return {
                ...state,
                user: action.user
            }
        case actionType.SET_CAMPAIGNS:
            return {
                ...state,
                campaigns: action.campaigns
            }
        default:
            return state
        }
}