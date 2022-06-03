import { setting } from "./game_components.js";

export default class Multiplay{
    constructor($parent){
        this.$parent = $parent;
        this.$parent.innerHTML = '';

        this.render();
        this.$child = $parent.querySelector('#game-section');
        this.component;

        this.$parent.querySelector('#practice-menu').addEventListener('click',(e)=>{
            if(e.target.nodeName !=='A')return;
            e.preventDefault();
        })
    
    }

    render(){
        const templet = `
    <div class="components components-flex">
        <aside id="practice-menu">
            <span>대결하기</span>
            <nav>
                <ul>
                <li><a href="/">무작위 단어</a></li>
                <li><a href="/">스피드 넘버</a></li>
                <li><a href="/">스피드 카드</a></li>
                <li><a href="/">랜덤 이미지</a></li>
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
        alert('중비중입니다...');

       
    }
}