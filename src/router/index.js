import Vue from 'vue'
import Router from 'vue-router'
import Home from "../components/Home";
import Login from "../components/Login";
import Register from "../components/Register";
import Smslogin from "../components/Smslogin";


Vue.use(Router);

export default new Router({
    routes: [
        {
            path: '/',
            name: 'Home',
            component: Home
        },
        {
            path: '/home',
            name: "Home",
            component: Home
        },
        {
            path: '/home/login',
            name: "login",
            component: Login
        },
        {
            path: '/home/register',
            name:"register",
            component: Register
        },
        {
            path: '/home/sms',
            name:"sms",
            component: Smslogin
        },
    ]
})
