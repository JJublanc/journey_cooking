import { createContext, useEffect, useReducer } from "react";
import axios from "axios";
import { jwtDecode } from "jwt-decode"; // Add this import
import { MatxLoading } from "app/components";

const initialState = {
    user: null,
    isInitialized: false,
    isAuthenticated: false
};

const reducer = (state, action) => {
    switch (action.type) {
        case "INIT": {
            const { isAuthenticated, user } = action.payload;
            return { ...state, isAuthenticated, isInitialized: true, user };
        }
        case "LOGIN": {
            const { user } = action.payload;
            if (user.token) {
                localStorage.setItem('token', user.token);
            } else {
                console.error('No token received');
            }
            return { ...state, isAuthenticated: true, user };

        }
        case "LOGOUT": {
            localStorage.removeItem('token');
            return { ...state, isAuthenticated: false, user: null, token: null };
        }
        case "REGISTER": {
            const { user } = action.payload;
            if (user.token) {
                localStorage.setItem('token', user.token);
            } else {
                console.error('No token received');
            }
            return { ...state, isAuthenticated: true, user };
        }
        default:
            return state;
    }
};

const AuthContext = createContext({
    ...initialState,
    method: "JWT",
    login: () => {},
    logout: () => {},
    register: () => {}
});

export const AuthProvider = ({ children }) => {
    const [state, dispatch] = useReducer(reducer, initialState);

    const login = async (email, password) => {
        const response = await axios.post(`${process.env.REACT_APP_API_URL}/auth/login`, { email, password });
        const user = response.data.user
        dispatch({ type: "LOGIN", payload: { user } });
    };

    const register = async (email, username, password) => {
        const response = await axios.post(`${process.env.REACT_APP_API_URL}/auth/signup`, { email, name: username, password });
        const user = response.data.user ;
        dispatch({ type: "REGISTER", payload: { user } });
    };

    const logout = () => {
        dispatch({ type: "LOGOUT" });
    };

    useEffect(() => {
        (async () => {
            try {
                const token = localStorage.getItem('token');
                if (token) {
                    const decodedToken = jwtDecode(token);
                    const currentTime = Date.now() / 1000;

                    if (decodedToken.exp < currentTime) {
                        localStorage.removeItem('token');
                        dispatch({ type: "INIT", payload: { isAuthenticated: false, user: null } });
                    } else {
                        const { data } = await axios.get(`${process.env.REACT_APP_API_URL}/auth/profile`, {
                            headers: { Authorization: `Bearer ${token}` }
                        });
                        dispatch({ type: "INIT", payload: { isAuthenticated: true, user: data.user } });
                    }
                } else {
                    dispatch({ type: "INIT", payload: { isAuthenticated: false, user: null } });
                }
            } catch (err) {
                console.error(err);
                dispatch({ type: "INIT", payload: { isAuthenticated: false, user: null } });
            }
        })();
    }, []);

    if (!state.isInitialized) return <MatxLoading />;

    return (
        <AuthContext.Provider value={{ ...state, method: "JWT", login, logout, register }}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthContext;
