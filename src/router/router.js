import Main_nav from "../components/Main_nav.js";
import Practice from "../components/Practice.js";
import Word from "../components/word.js";
import Card from "../components/Card.js";
import Number from "../components/Number.js";
import Image from "../components/Image.js";
import Multiplay from "../components/Multiplay.js";

const routes = [
    { path: '/', component: Main_nav, depth: 0 },
    { path: '/multiplay', component: Multiplay, depth: 1 },
    { path: '/practice', component: Practice, depth: 1 },
    // { path: '/practice/word', component: Word, depth: 2 },
    // { path: '/practice/number', component: Number, depth: 2 },
    // { path: '/practice/card', component: Card, depth: 2 },
    // { path: '/practice/image', component: Image, depth: 2 },
];

export const render = () => {
    const href = location.pathname;

    const { component } = routes.find((route) => route.path === href);
    if (component) {
        return component;
    } else {
        return false;
    }
}