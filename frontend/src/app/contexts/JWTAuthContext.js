import {createContext, useEffect, useReducer} from "react";
import axios from "axios";
// CUSTOM COMPONENT
import {MatxLoading} from "app/components";

const initialState = {
    user: null,
    isInitialized: false,
    isAuthenticated: false
};

const reducer = (state, action) => {
    switch (action.type) {
        case "INIT": {
            const {isAuthenticated, user} = action.payload;
            return {...state, isAuthenticated, isInitialized: true, user};
        }

        case "LOGIN": {
            const { user, token } = action.payload;
            localStorage.setItem('token', token);
            return {
                ...state,
                isAuthenticated: true,
                user: user,
                token: token,
            };
        }

        case "LOGOUT": {
            localStorage.removeItem('token');
            return {...state, isAuthenticated: false, user: null, token: null};
        }

        case "REGISTER": {
            const {user, token} = action.payload;

            // Sauvegardez le token dans le local storage
            localStorage.setItem('token', token);

            return {...state, isAuthenticated: true, user, token};
        }

        default:
            return state;
    }
};

const AuthContext = createContext({
    ...initialState,
    method: "JWT",
    login: () => {
    },
    logout: () => {
    },
    register: () => {
    }
});

export const AuthProvider = ({children}) => {
    const [state, dispatch] = useReducer(reducer, initialState);

    const login = async (email, password) => {
        const response = await axios.post(`${process.env.REACT_APP_API_URL}/api/auth/login`, {
            email,
            password
        });
        const {user} = response.data;

        dispatch({type: "LOGIN", payload: {user}});
    };

    const register = async (email, username, password) => {
        const response = await axios.post(`${process.env.REACT_APP_API_URL}/api/auth/signup`,
            {
                "email": email,
                "name": username,
                "password": password
            });
        console.log(response)
        const {user} = response.data;
        dispatch({type: "REGISTER", payload: {user}});
    };

    const logout = () => {
        dispatch({type: "LOGOUT"});
    };

    useEffect(() => {
        (async () => {
            try {
                const {data} = await axios.get("/api/auth/profile");
                dispatch({
                    type: "INIT",
                    payload: {isAuthenticated: true, user: data.user}
                });
            } catch (err) {
                console.error(err);
                dispatch({
                    type: "INIT",
                    payload: {isAuthenticated: false, user: null}
                });
            }
        })();
    }, []);

    // SHOW LOADER
    if (!state.isInitialized) return <MatxLoading/>;

    return (
        <AuthContext.Provider
            value={{...state, method: "JWT", login, logout, register}}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthContext;
