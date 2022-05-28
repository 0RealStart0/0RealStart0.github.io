import { render } from "./router/router.js";
import Main_nav from "./components/Main_nav.js";


export default class App {

    constructor($app) {
        this.$target = $app;
        // console.log(this.$target);
        // this.componentArr = [null,null,null];
        this.component;
        this.main_nav;
        this.init();


        window.addEventListener('popstate', (e) => {
            e.preventDefault();
            // console.log(location.pathname, 'popstate');

            if (location.pathname === '/') {
                this.init();
            } else {
                this.result = render();
                if (!this.result) {
                    history.pushState(null, null, '/');
                } else{
                    this.component = new this.result(this.main_nav.$child);
                }
                

            }

        });
    }

    async init() {
        this.main_nav = new Main_nav(this.$target);
        // this.component = new this.component(this.$target);
        // this.componentArr[0] = this.component;
    }

}