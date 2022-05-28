import {render} from '../router/router.js';

export default class Main_nav{
    constructor($target,componentArr){
        this.$target = $target;
        this.$target.innerHTML = '';
        this.$container = document.createElement('div');
        this.$container.className = 'container';
        this.$target.appendChild(this.$container);
        this.$child = document.createElement('div');
        this.$child.className = 'container';
        
        this.$target.appendChild(this.$child);
        this.render();

        this.component;

        this.$container.addEventListener('click',(e)=>{
            if(e.target.nodeName !=='A') return;
            if(e.target.className !=='menu-item') return;
            e.preventDefault();
            if(e.target.href === location.pathname) return;
            history.pushState(null,null,e.target.href);
            this.component = render();
            this.component = new this.component(this.$child);

            // componentArr[1] = this.component;
            // console.log(this.component);
        });
    }


    render(){
        const templet = `<div class="terminal-nav">
                            <div class="terminal-logo">
                            <div class="logo terminal-prompt"><a href="/" class="no-style">Memory Sport</a></div>
                            </div>
                            <nav class="terminal-menu">
                            <ul>
                                <li><a class="menu-item" href="/practice">연습하기</a></li>
                                <li><a class="menu-item" href="/multiplay">대결하기</a></li>
                            </ul>
                            </nav>
                        </div>`;
    this.$container.innerHTML = templet;
    // this.$container.appendChild(this.$child);
    console.log('컴포넌트 실행')
    }

    
}