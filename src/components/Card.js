import { setting, ready, memory, recall, result } from "./game_components.js";
// import { reqRandomWord } from "../api/api.js";
import { show, timer, groupColorChange, arrowBtnEvent, elementColorChange, phase1Helper, phase3Helper,groupColor } from "../utils/utils.js";
import { randomCard, getCardSet } from "../../data/card.js";

export default class Card {
    constructor($parent) {
        this.$parent = $parent;
        this.$parent.innerHTML = '';
        this.$record;
        this.data = {};
        this.render();
        
        
        this.$gamecontainer = document.createElement('div');
        this.$gamecontainer.className = 'game-container card';

    }
    
    render() {
        this.$parent.appendChild(setting.bind(this)(['card','스피드 단어'],{fnc:randomCard},false));
    }

    phase1() {
        this.$parent.innerHTML = '';
        this.$gamecontainer.innerHTML = '';


        //설정에서 그룹 수와 나누었을때 총 그룹의 갯수
        const group = parseInt(this.data.setting.group);
        let groupLength = Math.floor(this.data.cardList.length / group);
        if (this.data.cardList.length % group !== 0) groupLength++;



        let cardTable = `
        <div class="table-container card" style="visibility:hidden" >
        <table class="card-table">
                            <tbody>
                                <tr>`;

        for (let i = 0; i < this.data.cardList.length; i++) {
            let card = this.data.cardList[i];
            if (i % 13 === 0 && i !== 0) {
                cardTable += `
                                        </tr>
                                        <tr>`;
            }
            cardTable += `
                                    <td data-index="${i}" data-card="${this.data.cardList[i]}" data-group="${Math.floor((i / group))}">
                                    <span ${(card[card.length-1] === '♥' || card[card.length-1] === '◆') ? `style="color: red;"` : ``} >${card.slice(0,card.length-1)}<br>${card[card.length-1]}</span>
                                    </td>
                                    `;

        }

        cardTable += `</tr>
                                </tbody>
                                </table>
                                </div>
                                <div class="practice-arrow" style="visibility:hidden">
                                <button class="btn btn-primary" data-move="0">&lt; &lt;</button>
                                <button class="btn btn-primary" data-move="-1">&lt;</button>
                                <button class="btn btn-primary" data-move="1">&gt;</button>
                                </div>
                                `

        this.$gamecontainer.innerHTML = ready + cardTable;
        this.$parent.appendChild(this.$gamecontainer);

        phase1Helper.bind(this)(groupColor,groupLength,'card');
    }

    phase3(record) {
        this.$gamecontainer.innerHTML = '';

        let cardSet = getCardSet();

        let recallCardTable = `
        <div class="table-container card" style="visibility:hidden" >
                            <table class="card-table recall-card-table">
                                <tbody>
                                    <tr>`;

        for (let i = 0; i < this.data.cardList.length; i++) {
            let card = this.data.cardList[i].split('');
            if (i % 13 === 0 && i !== 0) {
                recallCardTable += `
                            </tr>
                            <tr>`;
            }
            recallCardTable += `
                        <td data-index="${i}" data-total-index="" data-card=""></td>
                        `;

        }


        recallCardTable += `
                </tr>
                </tbody>
            </table>
        </div>

        <div class="container-recall-card-selector" style="visibility:hidden" >
            <div class="recall-card-selector">
                <button class="btn btn-default btn-ghost" data-index="0">♠</button>
                <button class="btn btn-default btn-ghost" data-index="1"><span style="color: red;">♥</span></button>
                <button class="btn btn-default btn-ghost" data-index="2">♣</button>
                <button class="btn btn-default btn-ghost" data-index="3"><span style="color: red;">◆</span></button>
            </div>
            <div class="recall-card-list">
                <table class="card-table recall-card-table">
                    <tr class="card-set">
                       ${cardSet[0].map((card, i) => {
            return `
                           <td data-index="${i}" data-total-index="${0},${i}" data-card="${card}" >
                             <span ${(card[card.length - 1] === '♥' || card[card.length - 1] === '◆') ? `style="color: red;"` : ``} >${card.slice(0, card.length - 1)}<br>${card[card.length - 1]}</span>
                            </td>
                           `
        }).join("")}
                    </tr>   
                </table>
            </div>
        </div>

                        `

        this.$gamecontainer.innerHTML = ready + recallCardTable;
        phase3Helper.bind(this)(record);
    }

    phase4($record) {

        //카운트창 변경 및 리콜창 보여주기
        const tpl = document.createElement('template');
        tpl.innerHTML = memory;
        const fragment = tpl.content;

        this.$gamecontainer.replaceChild(fragment, this.$gamecontainer.querySelector('.game-status'));
        this.$gamecontainer.querySelector('.table-container.card').style.visibility = 'visible';
        this.$gamecontainer.querySelector('.container-recall-card-selector').style.visibility = 'visible';

        //기록 추가하기
        const $gameStatus = this.$gamecontainer.querySelector('.game-status');
        $gameStatus.insertBefore($record, $gameStatus.querySelector('.progress-bar'));
        show.bind(this)();//타이머 그래프 설정에 따라 감춤

        //타이머 시작 
        let $progress = this.$gamecontainer.querySelector('.game-status');
        let interval = timer.bind(this)(600, $progress, this.phase5.bind(this));

        this.$gamecontainer.querySelector('.game-status').querySelector('.btn').addEventListener('click', (e) => {
            clearInterval(interval);
            this.phase5(this.$record);
        });

        //td 요소 수집후 인덱스로 정렬 
        const $cardTable = this.$gamecontainer.querySelector('.card-table');
        let tdSet = [...$cardTable.getElementsByTagName('td')].sort((a, b) => {
            return a.dataset.index - b.dataset.index;
        });

        elementColorChange(tdSet, 0, 0, 'var(--group-color)');

        //골라 넣을 카드 세트
        let cardSet = getCardSet();
        let $cardSelector = this.$gamecontainer.querySelector('.container-recall-card-selector');
        let $cardSet = $cardSelector.querySelector('.card-set');
        //클릭이 리콜칸 배경색 변경
        let now = 0;
        $cardTable.addEventListener('click', (e) => {
            if (e.target.nodeName === 'TD' || e.target.nodeName === 'SPAN') {
                let index = parseInt(e.target.dataset.index);
                let td = e.target
                if( e.target.nodeName === 'SPAN'){
                    index =parseInt(e.target.parentNode.dataset.index);
                    td = e.target.parentNode;
                }
                if(index === now && td.dataset.card){
                    const [x,y] = td.dataset.totalIndex.split(',');
                    const cardStr = td.dataset.card; 
                    // console.log('재클릭',x,y,cardStr);
                    cardSet[x][y] = cardStr;

                    td.dataset.totalIndex = '';
                    td.dataset.card = '';
                    td.innerHTML = '';

                    [...$cardSet.children].forEach((td)=>{
                        if(td.dataset.totalIndex === `${x},${y}`){
                            td.dataset.totalIndex = `${x},${y}`;
                            td.dataset.card = cardStr;
                            td.innerHTML = `<span ${(cardStr[cardStr.length - 1] === '♥' || cardStr[cardStr.length - 1] === '◆') ? `style="color: red;"` : ``} >${cardStr.slice(0, cardStr.length - 1)}<br>${cardStr[cardStr.length - 1]}</span>`
                        }
                    });  
                
                }
                
                elementColorChange(tdSet, index, now, groupColor);
                now = index;
            }
            // console.log(!tdSet[now].dataset.card);
        });



        $cardSelector.firstElementChild.addEventListener('click', (e) => {
            if (e.target.nodeName === 'BUTTON' || e.target.nodeName === 'SPAN') {
                let index = e.target.dataset.index;
                if (e.target.nodeName === 'SPAN') {
                    index = e.target.parentNode.dataset.index;
                }
                $cardSet.innerHTML =
                    `${cardSet[index].map((card, i) => {
                        return `
                    <td data-index="${i}" data-total-index="${index},${i}" data-card="${card}" >
                    ${!card ? '' :`<span ${(card[card.length - 1] === '♥' || card[card.length - 1] === '◆') ? `style="color: red;"` : ``} >${card.slice(0, card.length - 1)}<br>${card[card.length - 1]}</span>`}
                     </td>
                    `
                    }).join("")}`;
            }
        });

        $cardSet.addEventListener('click',(e)=>{
            if (e.target.nodeName === 'TD' || e.target.nodeName === 'SPAN'){
                let td = e.target; 
                if(e.target.nodeName === 'SPAN'){
                    td = e.target.parentNode;
                }
                if(!td.dataset.card) return;
                const [x,y] = td.dataset.totalIndex.split(',');
                const cardStr = td.dataset.card;
                cardSet[x][y] = '';
                td.dataset.card = '';
                td.innerHTML = '';

                if(tdSet[now].dataset.card){
                    const[nx,ny] = tdSet[now].dataset.totalIndex.split(',');
                    const nCardStr = tdSet[now].dataset.card;
                    cardSet[nx][ny] = nCardStr;
                    [...$cardSet.children].forEach((td)=>{
                        if(td.dataset.totalIndex === `${nx},${ny}`){
                            td.dataset.totalIndex = `${nx},${ny}`;
                            td.dataset.card = nCardStr;
                            td.innerHTML = `<span ${(nCardStr[nCardStr.length - 1] === '♥' || nCardStr[nCardStr.length - 1] === '◆') ? `style="color: red;"` : ``} >${nCardStr.slice(0, nCardStr.length - 1)}<br>${nCardStr[nCardStr.length - 1]}</span>`
                        }
                    });   
                }
                tdSet[now].dataset.totalIndex = `${x},${y}`;
                tdSet[now].dataset.card = cardStr;
                tdSet[now].innerHTML = `<span ${(cardStr[cardStr.length - 1] === '♥' || cardStr[cardStr.length - 1] === '◆') ? `style="color: red;"` : ``} >${cardStr.slice(0, cardStr.length - 1)}<br>${cardStr[cardStr.length - 1]}</span>`;

                // console.log('현재 인덱스',now)
                if((now+1)>=tdSet.length){
                    elementColorChange(tdSet, 0, now, groupColor);
                    now = 0;
                }else{
                    elementColorChange(tdSet, now+1, now, groupColor);
                    now = now + 1;
                }
                // console.log('변경후 인덱스',now)

            }
        });



     
    }

    phase5($record) {
        let resultSet = [...this.$gamecontainer.querySelector('.card-table').getElementsByTagName('td')].map((td)=>{
            return [td.dataset.card,parseInt(td.dataset.index)];
        });
        const cardList = this.data.cardList;
        const total = cardList.length;
        let count = total;
        
        for(let i=0; i<resultSet.length; i++){
            // console.log(resultSet[i][0],cardList[i]);
            let card = resultSet[i][0];
            resultSet[i][0] = `
            <span>
                ${cardList[i]}
            </span><br>`;
            if(cardList[i]!==card){
                count--;
                resultSet[i][0] += `${card ? `<del>${card}</del>` : `<span style="color:var(--font-color);">✘</span>` }`;
                
            }else{
                resultSet[i][0] += `<span style="color:var(--font-color);">✔</span>`;
                
            }
            // console.log(resultSet[i][0]);
        }
        
        this.$parent.innerHTML = '';
        this.$gamecontainer.innerHTML = '';

        let resultCardTable = `
        <div class="table-container card">
                            <table class="card-table recall-card-table">
                                <tbody>
                                    <tr>`;

        for (let i = 0; i < resultSet.length; i++) {
            // let card = this.data.cardList[i].split('');
            if (i % 13 === 0 && i !== 0) {
                resultCardTable += `
                            </tr>
                            <tr>`;
            }
            // ${(cardStr[cardStr.length - 1] === '♥' || cardStr[cardStr.length - 1] === '◆') ? `style="color: red;"` : ``} 
            resultCardTable += `
                        <td style="font-size:15px; line-height:30px; ${(cardList[i][cardList[i].length - 1] === '♥' || cardList[i][cardList[i].length - 1] === '◆') ? `color: red;` : ``}" >${resultSet[i][0]}</td>
                        `;

        }


        resultCardTable += `
                </tr>
                </tbody>
            </table>
        </div>`;
        

        this.$gamecontainer.innerHTML = result + resultCardTable;

        //점수 만들어 추가하기
        let $result = document.createElement('span');
        $result.className = 'result';
        $result.textContent = `점수 : ${count}/${total}`;

        const $gameStatus = this.$gamecontainer.querySelector('.game-status');
        $gameStatus.appendChild($result);
        $gameStatus.appendChild($record);

        $gameStatus.querySelector('.btn').addEventListener('click',(e)=>{
            this.$parent.innerHTML = '';
            this.render();
        }); 

        this.$parent.appendChild(this.$gamecontainer);


        // //버튼 이벤트
        // let falseSet = [...this.$gamecontainer.querySelector('.table-container.word').getElementsByClassName('false')]
        // // console.log(this.$gamecontainer.querySelector('.table-container.word'))
        // // console.log(falseSet);
        // let test = [...this.$gamecontainer.querySelector('.table-container.word').getElementsByClassName('falsesd')];
        // console.log(test.length,'test');
        // this.$gamecontainer.querySelector('.show-answer').addEventListener('click',(e)=>{
        //     if (e.target.nodeName !== 'BUTTON') return;
        //     console.log('버트이벤트',e.target.value);
        //     console.log(falseSet.length,'배열갯수');
        //     if(falseSet.length>0){
        //         if(e.target.value==="true"){
        //             falseSet.forEach((span)=>{
        //                 span.firstElementChild.style.display = 'none';
        //                 span.lastElementChild.style.display = 'inline';
        //             });
        //         }else{
        //             falseSet.forEach((span)=>{
        //                 span.firstElementChild.style.display = 'inline';
        //                 span.lastElementChild.style.display = 'none';
        //             });  
        //         }
        //     }
        // });
    }
}