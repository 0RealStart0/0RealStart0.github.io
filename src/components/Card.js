import { setting, ready, memory, recall, result } from "./game_components.js";
// import { reqRandomWord } from "../api/api.js";
import { show, timer, groupColorChange, arrowBtnEvent, elementColorChange } from "../utils/utils.js";
import { randomCard, getCardSet } from "../../data/card.js";

export default class Card {
    constructor($parent) {
        this.$parent = $parent;
        this.$parent.innerHTML = '';
        this.render();

        this.$record;
        this.data = {};

        this.$gamecontainer = document.createElement('div');
        this.$gamecontainer.className = 'game-container card';

    }

    render() {
        this.$parent.innerHTML = setting('스피드 카드');
        this.$parent.querySelector('.setting-fieldset').addEventListener('submit', async (e) => {
            e.preventDefault();
            const { group, ready, num, graph } = e.target;
            console.log(group.value, ready.value, num.checked, graph.checked);
            this.data.setting = { group: group.value, ready: ready.value, timeShow: num.checked, graphShow: graph.checked };
            this.data.cardList = randomCard();
            this.phase1();
        })
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

        //td 모아서 인덱스 그룹별로 모으기
        let tdSet = Array.from(Array(groupLength), () => new Array());
        [...this.$gamecontainer.getElementsByTagName('td')].forEach((td) => {
            tdSet[td.dataset.group].push(td);
        });

        //버튼 이벤트 추가
        // let now = 0;
        // let before = 0;
        groupColorChange(tdSet, 0, 0, 'white');
        this.$gamecontainer.querySelector('.practice-arrow').addEventListener('click', arrowBtnEvent(groupLength, tdSet));

        this.$parent.appendChild(this.$gamecontainer);

        let $progress = this.$gamecontainer.querySelector('.game-status');
        let interval = timer.bind(this)(this.data.setting.ready, $progress, this.phase2.bind(this));
        $progress.querySelector('.btn').addEventListener('click', (e) => {
            clearInterval(interval);
            this.phase2();
        });

    }

    phase2() {
        console.log('페이즈2');

        const tpl = document.createElement('template');
        tpl.innerHTML = memory;
        const fragment = tpl.content;

        this.$gamecontainer.replaceChild(fragment, this.$gamecontainer.querySelector('.game-status'));
        this.$gamecontainer.querySelector('.table-container.card').style.visibility = 'visible';
        this.$gamecontainer.querySelector('.practice-arrow').style.visibility = 'visible';
        show.bind(this)();//타이머 그래프 설정에 따라 감춤

        let startTime = new Date().getTime();
        let interval = timer.bind(this)(300, this.$gamecontainer, this.phase3.bind(this));
        this.$gamecontainer.querySelector('.game-status').querySelector('.btn').addEventListener('click', (e) => {
            clearInterval(interval);
            let endTime = new Date().getTime();
            let record = endTime - startTime;
            this.phase3(parseInt(record));
        });
    }

    phase3(record) {
        console.log('페이즈3');
        console.log('기록', record);

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
        const $gameStatus = this.$gamecontainer.querySelector('.game-status');
        const $record = document.createElement('span');
        record = record ? record : 300000;
        const recordSeconds = Math.floor(record / 10) / 100;
        const minutes = Math.floor(recordSeconds / 60);
        const seconds = (recordSeconds % 60).toFixed(2);
        console.log(record, '밀리초', recordSeconds);
        $record.textContent = `기록 ${minutes < 10 ? '0' + minutes : minutes}:${seconds < 10 ? '0' + seconds : seconds}`;
        $record.dataset.record = record;
        $gameStatus.insertBefore($record, $gameStatus.lastElementChild);


        let $progress = this.$gamecontainer.querySelector('.game-status');
        let interval = timer.bind(this)(this.data.setting.ready, $progress, this.phase4.bind(this));

        this.$record = $record;
        this.$gamecontainer.querySelector('.game-status').querySelector('.btn').addEventListener('click', (e) => {
            clearInterval(interval);
            this.phase4(this.$record);
        });

    }

    phase4($record) {
        console.log('페이즈4');

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

        //td 요소 수집후 인덱스로 정렬 
        const $cardTable = this.$gamecontainer.querySelector('.card-table');
        let tdSet = [...$cardTable.getElementsByTagName('td')].sort((a, b) => {
            return a.dataset.index - b.dataset.index;
        });

        elementColorChange(tdSet, 0, 0, 'white');

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
                
                elementColorChange(tdSet, index, now, 'white');
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
                    elementColorChange(tdSet, 0, now, 'white');
                    now = 0;
                }else{
                    elementColorChange(tdSet, now+1, now, 'white');
                    now = now + 1;
                }
                // console.log('변경후 인덱스',now)

            }
        });



        //타이머 시작 
        let $progress = this.$gamecontainer.querySelector('.game-status');
        let interval = timer.bind(this)(600, $progress, this.phase5.bind(this));

        this.$gamecontainer.querySelector('.game-status').querySelector('.btn').addEventListener('click', (e) => {
            clearInterval(interval);
            this.phase5(this.$record);
        });

    }

    phase5($record) {
        console.log('페이즈5');
        let resultSet = [...this.$gamecontainer.querySelector('.card-table').getElementsByTagName('td')].map((td)=>{
            return [td.dataset.card,parseInt(td.dataset.index)];
        });
        console.log(resultSet.length,"결과 크기");
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
                resultSet[i][0] += `${card ? `<del>${card}</del>` : `<span style="color:#151515">✘</span>` }`;
                
            }else{
                resultSet[i][0] += `<span style="color:#151515">✔</span>`;
                
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