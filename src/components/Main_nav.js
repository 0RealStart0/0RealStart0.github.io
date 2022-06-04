import { render } from '../router/router.js';
import { setCookie, getCookie } from '../utils/cookie.js';

export default class Main_nav {
    constructor($target) {
        this.$target = $target;
        this.$nav;
        this.$child;

        this.render();
        this.childComponent;
    }


    render() {
        this.$target.innerHTML = '';
        this.$nav = document.createElement('div');
        this.$nav.className = 'container';
        this.$target.appendChild(this.$nav);
        this.$child = document.createElement('div');
        this.$child.className = 'container';
        this.resetChild();
        this.$target.appendChild(this.$child);

        const templet = `<div class="terminal-nav">
                            <div class="terminal-logo">
                                <div class="logo terminal-prompt"><a href="/" class="no-style">Memory Sport</a></div>
                            </div>
                            <nav class="terminal-menu">
                            <ul>
                                <li><a class="menu-item" href="/practice">연습하기</a></li>
                                <li><a class="menu-item" href="/multiplay">대결하기</a></li>
                                <li class="dark-mode"></li>
                            </ul>
                            </nav>
                        </div>`;
        this.$nav.innerHTML = templet;

        this.$nav.addEventListener('click', (e) => {
            if (e.target.nodeName !== 'A') return;
            // if (e.target.className !== 'menu-item') return;
            e.preventDefault();
            history.pushState(null, null, e.target.href);
            // if (e.target.href.pathname === location.pathname) {
            //     console.log('리턴');
            //     return;
            // }
            if (location.pathname === '/') {
                // this.render();
                this.resetChild();
            } else {
                const { component } = render();
                this.childComponent = new component(this.$child);
                // this.componentArr[1] = this.childComponent;
            }

        });
        const $dark = this.$nav.querySelector('.dark-mode');

        this.currentMode = getCookie('isDark');
        if (!this.currentMode) {
            this.currentMode = window.matchMedia("(prefers-color-scheme: dark)").matches
                ? "dark"
                : "light";
        }

        if (this.currentMode === 'dark') {
            document.querySelector('body').className = 'dark';
            this.currentMode = 'dark';
            $dark.textContent = '⚪️';
        } else {
            document.querySelector('body').className = 'light';
            this.currentMode = 'light';
            $dark.textContent = '⚫️';
        }



        $dark.addEventListener('click', (e) => {
            if (this.currentMode === 'dark') {
                document.querySelector('body').className = 'light';
                this.currentMode = 'light';
                e.target.textContent = '⚫️';
                setCookie('isDark', 'light', { 'max-age': 86400 });
            } else {
                document.querySelector('body').className = 'dark';
                this.currentMode = 'dark';
                e.target.textContent = '⚪️';
                setCookie('isDark', 'dark', { 'max-age': 86400 });
            }
        });
    }

    resetChild() {
        this.$child.innerHTML = ``;


    }

}