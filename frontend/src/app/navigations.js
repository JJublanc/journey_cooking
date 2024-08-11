export const navigations = [

    {label: "Login/Signin", type: "label"},
    {
        name: "Session/Auth",
        icon: "security",
        children: [
            {name: "Sign in", iconText: "SI", path: "/session/signin"},
            {name: "Sign up", iconText: "SU", path: "/session/signup"},
            {
                name: "Forgot Password",
                iconText: "FP",
                path: "/session/forgot-password"
            },
            {name: "Error", iconText: "404", path: "/session/404"}
        ]
    },
    {label: "Séjours", type: "label"},
    {
        name: "Gérer vos séjours",
        icon: "favorite",
        badge: {value: "", color: "secondary"},
        children: [
            {
                name: "Nouveaux séjours",
                path: "/newJourney/default",
                icon: "dashboard"
            },
            {
                name: "Visualiser vos séjours",
                path: "/journeyInfo/default",
                icon: "pie_chart"
            },
        ]
    },
    {
        name: "Charts",
        icon: "trending_up",
        children: [{name: "Echarts", path: "/charts/echarts", iconText: "E"}]
    },
    {
        name: "Documentation",
        icon: "launch",
        type: "extLink",
        path: "http://demos.ui-lib.com/matx-react-doc/"
    }
];
