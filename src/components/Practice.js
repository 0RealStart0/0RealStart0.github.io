import { render } from "../router/router.js";
import Word from "../components/ord.js";
import Card from "../components/Card.js";
import Number from "../components/Number.js";
import Image from "../components/Image.js";

export default class Practice{
    constructor($parent){
        this.$parent = $parent;
        this.$parent.innerHTML = '';

        this.render();
        this.$child = $parent.querySelector('#game-section');
        this.component
        this.componentSet = {
            Word,Card,Number,Image
        };

        this.$parent.querySelector('#practice-menu').addEventListener('click',(e)=>{
            if(e.target.nodeName !=='A')return;
            e.preventDefault();
            //라우터 설정 
            // history.pushState(null,null,e.target.href);
            // this.component = render();
            // this.component = new this.component(this.$child);

            console.log('타겟',e.target.dataset.name);
            // 라우터 없이 바로
            this.component = this.componentSet[e.target.dataset.name];
            console.log(this.componentSet[e.target.dataset.name])
            this.component = new this.component(this.$child);
        })
    
    }

    render(){
        const templet = `
    <div class="components components-flex">
        <aside id="practice-menu">
            <span>연습하기</span>
            <nav>
                <ul>
                <li><a href="/practice/word" data-name="Word">무작위 단어</a></li>
                <li><a href="/practice/number" data-name="Number">스피드 넘버</a></li>
                <li><a href="/practice/card" data-name="Card">스피드 카드</a></li>
                <li><a href="/practice/image" data-name="Image">랜덤 이미지</a></li>
                    <!-- <li><a herf="#">목록</a></li> -->
                    
                </ul>
            </nav>
        </aside>
        <main>
            <section id='game-section'>
            </section>
        </main>
        <div></div>
    </div>`;

        this.$parent.innerHTML = templet;
    }

}
