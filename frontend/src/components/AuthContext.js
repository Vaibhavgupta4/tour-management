import { createContext, useEffect, useReducer } from "react";

const initial_state = {
    user: (() => {
        try {
            const stored = localStorage.getItem('user')
            return stored ? JSON.parse(stored) : null
        } catch {
            return null
        }
    })(),
    token: (() => {
        try { return localStorage.getItem('accessToken') || null } catch { return null }
    })(),
    loading: false,
    error: null,
}

export const AuthContext = createContext(initial_state)

const AuthReducer = (state, action) => {
    switch (action.type) {
        case 'LOGIN_START':
        return {
            user: null,
            token: null,
            loading: true,
            error: null,
        }
        case 'LOGIN_SUCCESS':
        return {
            user: action.payload,
            token: action.token || state.token || null,
            loading: false,
            error: null,
        }
        case 'LOGIN_FAILURE':
        return {
            user: null,
            token: null,
            loading: false,
            error: action.payload,
        }
        case 'REGISTER_SUCCESS':
        return {
            user: null,
            token: null,
            loading: false,
            error: null,
        }
        case 'LOGOUT':
        return {
            user: null,
            token: null,
            loading: false,
            error: null,
        }

        default:
        return state
    }
}


export const AuthContextProvider = ({children}) =>{
    const [state, dispatch] = useReducer(AuthReducer, initial_state)

    useEffect(() =>{
        localStorage.setItem('user', JSON.stringify(state.user))
    },[state.user])

    useEffect(() =>{
        if (state.token) localStorage.setItem('accessToken', state.token)
        else localStorage.removeItem('accessToken')
    },[state.token])

    return <AuthContext.Provider value={{
        user:state.user,
        token:state.token,
        loading: state.loading,
        error: state.error,
        dispatch,
    }}>
        {children}
    </AuthContext.Provider>
}
