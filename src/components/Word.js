import { setting, ready, memory, recall, result } from "./game_components.js";
import { reqRandomWord } from "../api/api.js";
import { show, timer, groupColorChange, arrowBtnEvent } from "../utils/utils.js";

export default class Word {
    constructor($parent) {
        this.$parent = $parent;
        this.$parent.innerHTML = '';
        this.$record;
        this.data = {};
        this.render();
        

        this.$gamecontainer = document.createElement('div');
        this.$gamecontainer.className = 'game-container word';
        
    }

    render() {
        this.$parent.appendChild(setting.bind(this)(['word','무작위 단어'],{fnc:reqRandomWord,num:90},true));
    }

    phase1() {
        this.$parent.innerHTML = '';
        this.$gamecontainer.innerHTML = '';


        //설정에서 그룹 수와 나누었을때 총 그룹의 갯수
        const group = parseInt(this.data.setting.group);
        let groupLength = Math.floor(this.data.wordList.length / group);
        if (this.data.wordList.length % group !== 0) groupLength++;



        let wordTable = `
        <div class="table-container word" style="visibility:hidden" >
        <table>
                                <tbody>
                                <tr>`;

        for (let i = 0; i < this.data.wordList.length; i++) {
            let rowIndex = Math.floor(i / 6);
            let index = (i % 6) * 15 + rowIndex;
            if (i % 6 === 0 && i !== 0) {
                wordTable += `
                                        </tr>
                                        <tr>`;
            }
            wordTable += `
                                    <td data-index="${index}" data-group="${Math.floor((index / group))}">${(index + 1) + "  " + this.data.wordList[i]}</td>
                                    `;

        }

        wordTable += `</tr>
                                </tbody>
                                </table>
                                </div>
                                <div class="practice-arrow" style="visibility:hidden">
                                <button class="btn btn-primary" data-move="0">&lt; &lt;</button>
                                <button class="btn btn-primary" data-move="-1">&lt;</button>
                                <button class="btn btn-primary" data-move="1">&gt;</button>
                                </div>
                                `

        this.$gamecontainer.innerHTML = ready + wordTable;

        //td 모아서 인덱스 그룹별로 모으기
        let tdSet = Array.from(Array(groupLength), () => new Array());
        [...this.$gamecontainer.getElementsByTagName('td')].forEach((td) => {
            tdSet[td.dataset.group].push(td);
        });

        //버튼 이벤트 추가
        // let now = 0;
        // let before = 0;
        groupColorChange(tdSet, 0, 0, 'white');
        this.$gamecontainer.querySelector('.practice-arrow').addEventListener('click',arrowBtnEvent(groupLength,tdSet));

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
        this.$gamecontainer.querySelector('.table-container.word').style.visibility = 'visible';
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
        console.log('페이즈3!');
        this.$gamecontainer.innerHTML = '';

        let recallWordTable = `
        <div class="table-container word" style="visibility:hidden" >
                            <table class="recall-word-table">
                                <tbody>
                                    <tr>`;


        for (let i = 0; i < this.data.wordList.length; i++) {
            let rowIndex = Math.floor(i / 6);
            let index = (i % 6) * 15 + rowIndex;
            if (i % 6 === 0 && i !== 0) {
                recallWordTable += `
                </tr>
                <tr>`;
            }
            recallWordTable += `
                    <td data-index="${index}"><input type="text"  autocomplete="off" tabIndex="${parseInt(index)+1}"></td>
                `;

        }

        recallWordTable += `</tr>
                                </tbody>
                            </table>
                        </div>
                        `

        this.$gamecontainer.innerHTML = ready + recallWordTable;
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
        this.$gamecontainer.querySelector('.table-container.word').style.visibility = 'visible';

        //기록 추가하기
        const $gameStatus = this.$gamecontainer.querySelector('.game-status');
        $gameStatus.insertBefore($record, $gameStatus.querySelector('.progress-bar'));
        show.bind(this)();//타이머 그래프 설정에 따라 감춤

        //input 요소 수집후 탭인덱스로 정렬
        let tdSet = [...this.$gamecontainer.getElementsByTagName('input')].sort((a,b)=>{
            return a.tabIndex - b.tabIndex;
        });
        tdSet[0].focus();

        this.$gamecontainer.querySelector('.recall-word-table').addEventListener('keydown',(e)=>{
            if(e.target.nodeName !== 'INPUT') return;
            let index = parseInt(e.target.tabIndex);
            //index는 1부터 시작함
            if(e.key==='Enter' || e.key ==='ArrowDown'){
                if(index>=tdSet.length){
                    tdSet[0].focus();
                }else{
                    tdSet[index].focus();
                }
            }else if(e.key==='ArrowUp'){
                if(index===1){
                    tdSet[tdSet.length-1].focus();
                }else{
                    tdSet[index-2].focus();
                }
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
        let resultSet = [...this.$gamecontainer.getElementsByTagName('input')].map((input)=>{
            return [input.value.trim(),parseInt(input.tabIndex)-1];
        });
        // console.log(resultSet);

        const wordList = this.data.wordList;
        const total = wordList.length;
        let count = total;
        
        for(let i=0; i<resultSet.length; i++){
            if(wordList[i]!==resultSet[i][0]){
                count--;

                resultSet[i][0] = `
                <span class="false">
                <span  title="정답:${wordList[i]}">
                ${resultSet[i][0] ? 
                    `<del>${resultSet[i][0]}</del>`:
                    ``}
                </span>
                <span style="display:none" title="오답:${resultSet[i][0]}">${wordList[i]}</span>
                </span>`;
                
            }
        }
        
        this.$parent.innerHTML = '';
        this.$gamecontainer.innerHTML = '';

        let wordTable = `
        <div class="table-container word">
        <table>
                                <tbody>
                                <tr>`;

        for (let i = 0; i < resultSet.length; i++) {
            let rowIndex = Math.floor(i / 6);
            let index = (i % 6) * 15 + rowIndex;
            if (i % 6 === 0 && i !== 0) {
                wordTable += `
                                        </tr>
                                        <tr>`;
            }
            wordTable += `
                                    <td data-index="${index}">${(index+1)+" "+resultSet[i][0]}</td>
                                    `;

        }

        wordTable += `</tr>
                                </tbody>
                                </table>
                                </div>
                                <div class="practice-arrow show-answer">
                                <button class="btn btn-primary" value="true">정답 보기</button>
                                <button class="btn btn-primary" value="false">오답 보기</button>
                                </div>
                                `

        this.$gamecontainer.innerHTML = result + wordTable;

        //점수 만들어 추가하기
        let $result = document.createElement('span');
        $result.className = 'result';
        $result.textContent = `점수 : ${count}/${total}`;

        const $gameStatus = this.$gamecontainer.querySelector('.game-status');
        $gameStatus.appendChild($result);
        $gameStatus.appendChild($record);

        this.$parent.appendChild(this.$gamecontainer);


        //버튼 이벤트
        let falseSet = [...this.$gamecontainer.querySelector('.table-container.word').getElementsByClassName('false')]
        // console.log(this.$gamecontainer.querySelector('.table-container.word'))
        // console.log(falseSet);
        let test = [...this.$gamecontainer.querySelector('.table-container.word').getElementsByClassName('falsesd')];
        console.log(test.length,'test');
        this.$gamecontainer.querySelector('.show-answer').addEventListener('click',(e)=>{
            if (e.target.nodeName !== 'BUTTON') return;
            console.log('버트이벤트',e.target.value);
            console.log(falseSet.length,'배열갯수');
            if(falseSet.length>0){
                if(e.target.value==="true"){
                    falseSet.forEach((span)=>{
                        span.firstElementChild.style.display = 'none';
                        span.lastElementChild.style.display = 'inline';
                    });
                }else{
                    falseSet.forEach((span)=>{
                        span.firstElementChild.style.display = 'inline';
                        span.lastElementChild.style.display = 'none';
                    });  
                }
            }
        });
        //초 소숫점 2자리까지 수정 OK

        //준비 카운트 구현 -> 다음 페이즈 입력창 보여주기 + 상단에 기록 표기 + 카운트 시작 OK
        //셋팅에 따라서 숫자와 빠 안보여주기 OK

        //시간 1분 남았을때 색 변화(숫자와 바 둘다)OK
        //  타이머 함수와 타이머 감추는 함수 모듈로 만들기 OK


        // 암기할때 그룹만큼 색상 보여주고 버튼으로 이동 (속도문제) OK
        
        // 색상보여주기 키보드랑 연동
        
        // 리콜시에 칸 이동 포커스 이벤트 등등 OK
        // 결과 보여주기 OK

          //버튼 누르면 정답 오답 보여주기 OK
        // 마우스 클릭하면 정답 오답 보여주기 중 택?

        // 게임중에 현재 하는 게임에 배경색 설정 + 메인화면 깜빡이는거 멈춤

        //----------------옵션 
        // 타이머 진행중에 벗어나면 인터벌 종료, 페이지 벗어나도 타이머 끝나면 다음으로 진행되는 경우
        // 설정이후에 벗어날때 알림창으로 확인받기
        // 유틸 this문제 없이 작동 하는지 

        // 입력창에 숫자 보여주기 

        //타이머 끝날때까지 있으면 기록은 타이머에 주어진 시간으로 넘기기 -> 이러면 대기타이머에서도 기록이 넘어감
        // 아니면 기본 시간을this로 남겨서 타이머 넘어가면 기본 시간을 기록으로 넘기도록?
        //포커스 이동시 인풋에서 포커스 위치 (앞?뒤?드래그?)
        //복사 방지 드래그 방지
        
      

        // 확인버튼 누르면 메인페이지(드래그 효과 준 경우 되돌리기 )
        
        
    }

   
    recallEnd() {

    }

}