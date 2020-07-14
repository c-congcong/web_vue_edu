import Vue from 'vue'
import Router from 'vue-router'
import Home from "../components/Home";
import Login from "../components/Login";
import Register from "../components/Register";
import Smslogin from "../components/Smslogin";
import Course from "../components/Course";
import CourseDetail from "../components/CourseDetail";


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
        {
            path: '/python',
            name:"Course",
            component: Course
        },
        {
            path: '/course/detail',
            name:"Detail",
            component: CourseDetail
        },
        {
            path: '/course/detail/:id',
            name:"Detail",
            component: CourseDetail
        },
    ]
})