import { setting, ready, memory, recall, result } from "./game_components.js";
import { show, timer, groupColorChange, arrowBtnEvent, elementColorChange, phase1Helper } from "../utils/utils.js";

function randomNumber(n) {
    let arr = [];
    for (let i = 0; i < n; i++) {
        arr.push(Math.floor(Math.random() * 10));
    }
    return arr;

}

export default class Number {
    constructor($parent) {
        this.$parent = $parent;
        this.$parent.innerHTML = '';
        this.$record;
        this.data = {};
        this.render();
        
        
        this.$gamecontainer = document.createElement('div');
        this.$gamecontainer.className = 'game-container number';
        
    }
    
    
    render() {
        this.$parent.appendChild(setting.bind(this)(['number','스피드 넘버'],{fnc:randomNumber,num:400},false));

    }

    phase1() {
        this.$parent.innerHTML = '';
        this.$gamecontainer.innerHTML = '';


        //설정에서 그룹 수와 나누었을때 총 그룹의 갯수
        const group = parseInt(this.data.setting.group);
        let groupLength = Math.floor(this.data.numberList.length / group);
        if (this.data.numberList.length % group !== 0) groupLength++;



        let numberTable = `
        <div class="table-container number" style="visibility:hidden" >
        <table class="number-table">
                            <tbody>
                                <tr>`;

        for (let i = 0; i < this.data.numberList.length; i++) {
            let number = this.data.numberList[i];
            if (i % 40 === 0 && i !== 0) {
                numberTable += `
                                        </tr>
                                        <tr>`;
            }
            numberTable += `
                            <td data-index="${i}" data-number="${number}" data-group="${Math.floor((i / group))}">${number}</td>
                            `;

        }

        numberTable += `</tr>
                                </tbody>
                                </table>
                                </div>
                                <div class="practice-arrow" style="visibility:hidden">
                                <button class="btn btn-primary" data-move="0">&lt; &lt;</button>
                                <button class="btn btn-primary" data-move="-1">&lt;</button>
                                <button class="btn btn-primary" data-move="1">&gt;</button>
                                </div>
                                `

        this.$gamecontainer.innerHTML = ready + numberTable;
        this.$parent.appendChild(this.$gamecontainer);

        phase1Helper.bind(this)('#FFD814',groupLength, 'number');
    }

    phase3(record) {
        console.log('페이즈3');
        this.$gamecontainer.innerHTML = '';

        // let cardSet = getCardSet();

        let recallNumberTable = `
        <div class="table-container number" style="visibility:hidden" >
                            <table class="number-table recall-number-table">
                                <tbody>
                                    <tr>`;

        for (let i = 0; i < this.data.numberList.length; i++) {
            // let card = this.data.cardList[i].split('');
            if (i % 40 === 0 && i !== 0) {
                recallNumberTable += `
                            </tr>
                            <tr>`;
            }
            recallNumberTable += `
                        <td data-index="${i}" data-number=""></td>
                        `;

        }


        recallNumberTable += `
                </tr>
                </tbody>
            </table>
        </div>

        <div class="practice-arrow number-list" style="visibility:hidden">
            <button class="btn btn-primary" data-number="0">0</button>
            <button class="btn btn-primary" data-number="1">1</button>
            <button class="btn btn-primary" data-number="2">2</button>
            <button class="btn btn-primary" data-number="3">3</button>
            <button class="btn btn-primary" data-number="4">4</button>
            <button class="btn btn-primary" data-number="5">5</button>
            <button class="btn btn-primary" data-number="6">6</button>
            <button class="btn btn-primary" data-number="7">7</button>
            <button class="btn btn-primary" data-number="8">8</button>
            <button class="btn btn-primary" data-number="9">9</button>
        </div>

       `

        this.$gamecontainer.innerHTML = ready + recallNumberTable;
        const $gameStatus = this.$gamecontainer.querySelector('.game-status');
        const $record = document.createElement('span');
        record = record ? record : 300000;
        const recordSeconds = Math.floor(record / 10) / 100;
        const minutes = Math.floor(recordSeconds / 60);
        const seconds = (recordSeconds % 60).toFixed(2);
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
        this.$gamecontainer.querySelector('.table-container.number').style.visibility = 'visible';
        this.$gamecontainer.querySelector('.practice-arrow.number-list').style.visibility = 'visible';

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
        const $numberTable = this.$gamecontainer.querySelector('.number-table');
        let tdSet = [...$numberTable.getElementsByTagName('td')].sort((a, b) => {
            return a.dataset.index - b.dataset.index;
        });

        elementColorChange(tdSet, 0, 0, '#FFD814');

        //골라 넣을 카드 세트
        // let cardSet = getCardSet();
        // let $cardSelector = this.$gamecontainer.querySelector('.container-recall-card-selector');
        // let $cardSet = $cardSelector.querySelector('.card-set');
        //클릭이 리콜칸 배경색 변경
        let now = 0;

        $numberTable.addEventListener('click', (e) => {
            if (e.target.nodeName !== 'TD') return;
            let index = parseInt(e.target.dataset.index);
            elementColorChange(tdSet, index, now, '#FFD814');
            now = index;
        });

        window.addEventListener('keydown', (e) => {
            if (!$numberTable) return;
            if (isNaN(e.key)) {
                console.log(e.key);
                if (e.key === 'Backspace') {
                    tdSet[now].dataset.number = '';
                    tdSet[now].textContent = '';
                    if (now - 1 < 0) {
                        elementColorChange(tdSet, tdSet.length - 1, now, '#FFD814');
                        now = tdSet.length - 1;
                    } else {
                        elementColorChange(tdSet, now - 1, now, '#FFD814');
                        now = now - 1;
                    }
                }
                if (e.key === 'ArrowLeft') {
                    if (now - 1 < 0) {
                        elementColorChange(tdSet, tdSet.length - 1, now, '#FFD814');
                        now = tdSet.length - 1;
                    } else {
                        elementColorChange(tdSet, now - 1, now, '#FFD814');
                        now = now - 1;
                    }
                }

                if (e.key === 'Enter' || e.key === 'ArrowRight') {
                    if (now + 1 >= tdSet.length) {
                        elementColorChange(tdSet, 0, now, '#FFD814');
                        now = 0;
                    } else {
                        elementColorChange(tdSet, now + 1, now, '#FFD814');
                        now = now + 1;
                    }
                }
            } else {
                tdSet[now].dataset.number = e.key;
                tdSet[now].textContent = e.key;
                if (now + 1 >= tdSet.length) {
                    elementColorChange(tdSet, 0, now, '#FFD814');
                    now = 0;
                } else {
                    elementColorChange(tdSet, now + 1, now, '#FFD814');
                    now = now + 1;
                }
            }

        });

        const $numberList = this.$gamecontainer.querySelector('.number-list');
        $numberList.addEventListener('click', (e) => {
            if (e.target.nodeName !== 'BUTTON') return;
            let number = e.target.dataset.number;
            tdSet[now].textContent = number;
            tdSet[now].dataset.number = number;
            if (now + 1 >= tdSet.length) {
                elementColorChange(tdSet, 0, now, '#FFD814');
                now = 0;
            } else {
                elementColorChange(tdSet, now + 1, now, '#FFD814');
                now = now + 1;
            }
        });




     

    }

    phase5($record) {
        console.log('페이즈5');
        let resultSet = [...this.$gamecontainer.querySelector('.recall-number-table').getElementsByTagName('td')].map((td) => {
            return [td.dataset.number, parseInt(td.dataset.index)];
        });
        console.log(resultSet.length, "결과 크기");
        const numberList = this.data.numberList;
        const total = numberList.length;
        let count = total;

        for (let i = 0; i < resultSet.length; i++) {
            let number = resultSet[i][0].toString();
            resultSet[i][0] = `${numberList[i]}<br>`;
            if (numberList[i].toString() !== number) {
                count--;
                resultSet[i][0] += `<span style="color:red;">${number ? `<del>${number}<del>` : `&nbsp`}</span>`;
            } else {
                resultSet[i][0] += number;
            }
            // console.log(resultSet[i][0]);
        }

        this.$parent.innerHTML = '';
        this.$gamecontainer.innerHTML = '';

        let resultNumberTable = `
        <div class="table-container number">
                            <table class="number-table recall-number-table">
                                <tbody>
                                    <tr>`;

        for (let i = 0; i < resultSet.length; i++) {
            if (i % 40 === 0 && i !== 0) {
                resultNumberTable += `
                            </tr>
                            <tr>`;
            }
            resultNumberTable += `
                        <td>${resultSet[i][0]}</td>`;

        }


        resultNumberTable += `
                </tr>
                </tbody>
            </table>
        </div>`;


        this.$gamecontainer.innerHTML = result + resultNumberTable;

        //점수 만들어 추가하기
        let $result = document.createElement('span');
        $result.className = 'result';
        $result.textContent = `점수 : ${count}/${total}`;

        const $gameStatus = this.$gamecontainer.querySelector('.game-status');
        $gameStatus.appendChild($result);
        $gameStatus.appendChild($record);

        this.$parent.appendChild(this.$gamecontainer);
    }

    //윈도우 키 이벤트 삭제


}