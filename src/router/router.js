import Main_nav from "../components/Main_nav.js";
import Practice from "../components/Practice.js";
import Word from "../components/Word.js";
import Card from "../components/Card.js";
import Number from "../components/Number.js";
import Image from "../components/Image.js";
import Multiplay from "../components/Multiplay.js";

const routes = [
    { path: '/', component: Main_nav},
    { path: '/multiplay', component: Multiplay},
    { path: '/practice', component: Practice},
    // { path: '/practice/word', component: Word, parent: Practice },
    // { path: '/practice/number', component: Number, parent: Practice },
    // { path: '/practice/card', component: Card, parent: Practice },
    // { path: '/practice/image', component: Image, parent: Practice },
    // { path: '/multiplay/word', component: Word, parent: Multiplay },
    // { path: '/multiplay/number', component: Number, parent: Multiplay },
    // { path: '/multiplay/card', component: Card, parent: Multiplay },
    // { path: '/multiplay/image', component: Image, parent: Multiplay },
];

export const render = () => {
    const href = location.pathname;

    const result = routes.find((route) => route.path === href);
    if (result) {
        return result;
    } else {
        return false;
    }
}
