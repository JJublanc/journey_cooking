import { lazy } from "react";
import { Navigate } from "react-router-dom";

import AuthGuard from "./auth/AuthGuard";
import { authRoles } from "./auth/authRoles";

import Loadable from "./components/Loadable";
import MatxLayout from "./components/MatxLayout/MatxLayout";

import materialRoutes from "app/views/material-kit/MaterialRoutes";

// HOME PAGE
const HomePage = Loadable(lazy(() => import("app/views/homePage/HomePage")));

// SESSION PAGES
const NotFound = Loadable(lazy(() => import("app/views/sessions/NotFound")));
const JwtLogin = Loadable(lazy(() => import("app/views/sessions/JwtLogin")));
const JwtRegister = Loadable(lazy(() => import("app/views/sessions/JwtRegister")));
const ForgotPassword = Loadable(lazy(() => import("app/views/sessions/ForgotPassword")));

// DASHBOARD PAGE
const NewJourney = Loadable(lazy(() => import("app/views/newJourney/NewJourneypPage")));
const JourneyInfo = Loadable(lazy(() => import("app/views/journeyInfo/JourneyInfoPage")));

const routes = [
    {
        element: (
            <AuthGuard>
                <MatxLayout/>
            </AuthGuard>
        ),
        children: [
            ...materialRoutes,
            // home page route
            { path: "/home", element: <HomePage/> },
            // newJourney route
            {
                path: "/newJourney/default",
                element: (
                    <AuthGuard>
                        <NewJourney/>
                    </AuthGuard>
                ),
                auth: authRoles.admin
            },
            // e-chart route
            {
                path: "/journeyInfo/default",
                element: (
                    <AuthGuard>
                        <JourneyInfo/>
                    </AuthGuard>
                ),
                auth: authRoles.editor
            },
        ]
    },
    // home page route
    { path: "/", element: <Navigate to="/home"/> },
    { path: "*", element: <NotFound/> },

    // session pages route
    { path: "/session/404", element: <NotFound/> },
    { path: "/session/signin", element: <JwtLogin/> },
    { path: "/session/signup", element: <JwtRegister/> },
    { path: "/session/forgot-password", element: <ForgotPassword/> },
];

export default routes;
