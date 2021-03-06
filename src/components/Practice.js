import { render } from "../router/router.js";
import Word from "../components/Word.js";
import Card from "../components/Card.js";
import Number from "../components/Number.js";
import Image from "../components/Image.js";

export default class Practice{
    constructor($parent){
        this.$parent = $parent;
        this.$parent.innerHTML = '';
        this.$child;

        this.render();
        this.childComponent;
        this.componentSet = {
            Word,Card,Number,Image
        };
        
        
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
        this.$child = this.$parent.querySelector('#game-section');
        this.$parent.querySelector('#practice-menu').addEventListener('click',(e)=>{
            if(e.target.nodeName !=='A')return;
            e.preventDefault();
            //라우터 설정 
            // history.pushState(null,null,e.target.href);
            // this.component = render();
            // this.component = new this.component(this.$child);
            
            // 라우터 없이 바로
            this.childComponent = this.componentSet[e.target.dataset.name];
            this.childComponent = new this.childComponent(this.$child);
        })
    }

    resetChild(){
        this.$child.innerHTML = '';
    }

    
}
