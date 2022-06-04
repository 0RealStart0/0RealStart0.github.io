import { setting, ready, memory, recall, result } from "./game_components.js";
// import { reqRandomWord } from "../api/api.js";
import { show, timer, groupColorChange, arrowBtnEvent, elementColorChange, phase1Helper, phase3Helper, groupColor } from "../utils/utils.js";
import { reqRandomImage } from "../api/api.js";

export default class Image {
    constructor($parent) {
        this.$parent = $parent;
        this.$parent.innerHTML = '';
        this.$record;
        this.data = {};
        this.render();


        this.$gamecontainer = document.createElement('div');
        this.$gamecontainer.className = 'game-container image';
    }

    render() {
        // this.$parent.innerHTML = setting('랜덤 이미지');
        // [...this.$parent.querySelectorAll('.form-group')].forEach((div)=>{
        //     div.style.visibility = 'hidden';
        // })
        // this.$parent.querySelector('.btn').textContent = '준비중입니다...';
        // this.$parent.querySelector('.setting-fieldset').addEventListener('submit', async (e) => {
        //     e.preventDefault();
        //     alert('준비중입니다...');
        // })
        this.$parent.appendChild(setting.bind(this)(['image', '랜덤 이미지'], { fnc: reqRandomImage, num: 120 }, true));
        // alert('준비중입니다...');

    }

    phase1() {
        this.$parent.innerHTML = '';
        this.$gamecontainer.innerHTML = '';


        //설정에서 그룹 수와 나누었을때 총 그룹의 갯수
        const group = parseInt(this.data.setting.group);
        let groupLength = Math.floor(this.data.imageList.length / group);
        if (this.data.imageList.length % group !== 0) groupLength++;


        // style="visibility:hidden"
        let imageTable = `
        <div class="table-container image" style="visibility:hidden">
        <table class="image-table">
                            <tbody>
                                <tr>`;

        for (let i = 0; i < this.data.imageList.length; i++) {
            let image = this.data.imageList[i];
            if (i % 15 === 0 && i !== 0) {
                imageTable += `
                                        </tr>
                                        <tr>`;
            }
            imageTable += `
                                    <td data-index="${i}" data-image="${this.data.imageList[i]}" data-group="${Math.floor((i / group))}">
                                        ${this.data.imageList[i]}
                                    </td>
                                    `;

        }

        imageTable += `</tr>
                                </tbody>
                                </table>
                                </div>
                                <div class="practice-arrow" style="visibility:hidden">
                                <button class="btn btn-primary" data-move="0">&lt; &lt;</button>
                                <button class="btn btn-primary" data-move="-1">&lt;</button>
                                <button class="btn btn-primary" data-move="1">&gt;</button>
                                </div>
                                `

        this.$gamecontainer.innerHTML = ready + imageTable;
        this.$parent.appendChild(this.$gamecontainer);

        phase1Helper.bind(this)(groupColor, groupLength, 'image');
    }

    phase3(record) {
        console.log('페이즈3');
        this.$gamecontainer.innerHTML = '';

        //이미지 목록용 세트
        let imageSet = this.data.imageList.slice();
        this.imageSet = imageSet;
        let m = imageSet.length;
        let index;
        while (m) {
            index = Math.floor(Math.random() * m--);
            [imageSet[m], imageSet[index]] = [imageSet[index], imageSet[m]];
        }

        let imageTd = `<tr>`;
        for(let i=0; i<imageSet.length; i++){
            if (i % 15 === 0 && i !== 0) {
                imageTd += `</tr>
                            <tr>`;
            }
            imageTd += `<td data-index="${i}" data-image=${imageSet[i]}>
                            ${imageSet[i]}
                        </td>`
        }

        imageTd += `</tr>`;

        let recallImageTable = `
                        <div class="table-container image" style="visibility:hidden">
                            <table class="image-table recall-image-table">
                                <tbody>
                                    <tr>`;

        for (let i = 0; i < this.data.imageList.length; i++) {
            if (i % 15 === 0 && i !== 0) {
                recallImageTable += `
                            </tr>
                            <tr>`;
            }
            recallImageTable += `
                        <td data-index="${i}" data-list-index="" data-image=""></td>
                        `;

        }


        recallImageTable += `
                                    </tr>
                                </tbody>
                            </table>
                        </div>

        <div class="container-recall-image-selector" style="visibility:hidden">
            <div class="recall-image-list">
                <table class="image-set">
                      ${imageTd}   
                </table>
            </div>
        </div>

                        `

        this.$gamecontainer.innerHTML = ready + recallImageTable;
        phase3Helper.bind(this)(record);
    }

    phase4($record) {
        console.log('페이즈4');

        //카운트창 변경 및 리콜창 보여주기
        const tpl = document.createElement('template');
        tpl.innerHTML = memory;
        const fragment = tpl.content;

        this.$gamecontainer.replaceChild(fragment, this.$gamecontainer.querySelector('.game-status'));
        this.$gamecontainer.querySelector('.table-container.image').style.visibility = 'visible';
        this.$gamecontainer.querySelector('.container-recall-image-selector').style.visibility = 'visible';

        //기록 추가하기
        const $gameStatus = this.$gamecontainer.querySelector('.game-status');
        $gameStatus.insertBefore($record, $gameStatus.querySelector('.progress-bar'));
        show.bind(this)();//타이머 그래프 설정에 따라 감춤

        //타이머 시작 
        let $progress = this.$gamecontainer.querySelector('.game-status');
        
        let interval = timer.bind(this)(600, $gameStatus, this.phase5.bind(this));

        this.$gamecontainer.querySelector('.game-status').querySelector('.btn').addEventListener('click', (e) => {
            clearInterval(interval);
            this.phase5(this.$record);
        });

        //td 요소 수집후 인덱스로 정렬 
        const $imageTable = this.$gamecontainer.querySelector('.image-table');
        let tdSet = [...$imageTable.getElementsByTagName('td')].sort((a, b) => {
            return a.dataset.index - b.dataset.index;
        });
        // console.log(tdSet);

        elementColorChange(tdSet, 0, 0, 'var(--group-color)');

        //골라 넣을 카드 세트
        // let cardSet = getCardSet();
        let $imageSelector = this.$gamecontainer.querySelector('.container-recall-image-selector');
        let recallTdSet = [...$imageSelector.getElementsByTagName('td')].sort((a, b) => {
            return a.dataset.index - b.dataset.index;
        });
        //클릭이 리콜칸 배경색 변경
        let now = 0;
        $imageTable.addEventListener('click', (e) => {
            if (e.target.nodeName === 'TD') {
                let index = parseInt(e.target.dataset.index);
                let td = e.target
                
                if(index === now && td.dataset.image){
                    const listIndex = parseInt(td.dataset.listIndex);
                    const image = td.dataset.image; 
                    

                    td.dataset.listIndex = '';
                    td.dataset.image = '';
                    td.textContent = '';

                    recallTdSet.forEach((td)=>{
                        if(td.dataset.index == listIndex){
                            td.dataset.image = image;
                            td.textContent = image;
                        }
                    });  
                
                }
                
                elementColorChange(tdSet, index, now, groupColor);
                now = index;
            }
            // console.log(!tdSet[now].dataset.card);
        });



        

        $imageSelector.addEventListener('click',(e)=>{
            if (e.target.nodeName === 'TD'){
                let td = e.target; 
               
                if(!td.dataset.image) return;
                const index = td.dataset.index;
                const image = td.dataset.image;
                td.dataset.image = '';
                td.textContent = '';

                if(tdSet[now].dataset.image){
                    const listIndex = tdSet[now].dataset.listIndex;
                    const nImage = tdSet[now].dataset.image;
                    
                    recallTdSet.forEach((td)=>{
                        if(td.dataset.index == listIndex){
                            td.dataset.image = nImage;
                            td.textContent = nImage; 
                        }
                    });   
                }
                tdSet[now].dataset.listIndex = index;
                tdSet[now].dataset.image = image;
                tdSet[now].textContent = image;

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
        console.log('페이즈5');
        let resultSet = [...this.$gamecontainer.querySelector('.image-table').getElementsByTagName('td')].map((td)=>{
            return [td.dataset.image,parseInt(td.dataset.index)];
        });
        const imageList = this.data.imageList;
        const total = imageList.length;
        let count = total;
        
        for(let i=0; i<resultSet.length; i++){
            // console.log(resultSet[i][0],cardList[i]);
            let image = resultSet[i][0];
            resultSet[i][0] = `${imageList[i]}<br>`;

            if(imageList[i]!==image){
                count--;
                resultSet[i][0] += `${image ? `<del>${image}</del>` : `<span style="color:#151515">✘</span>` }`;
                
            }else{
                resultSet[i][0] += `<span style="color:#151515">✔</span>`;
                
            }
            // console.log(resultSet[i][0]);
        }
        
        this.$parent.innerHTML = '';
        this.$gamecontainer.innerHTML = '';

        let resultImageTable = `
        <div class="table-container card">
                            <table class="card-table recall-card-table">
                                <tbody>
                                    <tr>`;

        for (let i = 0; i < resultSet.length; i++) {
            // let card = this.data.cardList[i].split('');
            if (i % 15 === 0 && i !== 0) {
                resultImageTable += `
                            </tr>
                            <tr>`;
            }
            // ${(cardStr[cardStr.length - 1] === '♥' || cardStr[cardStr.length - 1] === '◆') ? `style="color: red;"` : ``} 
            resultImageTable += `
                        <td>${resultSet[i][0]}</td>
                        `;

        }


        resultImageTable += `
                </tr>
                </tbody>
            </table>
        </div>`;
        

        this.$gamecontainer.innerHTML = result + resultImageTable;
        // this.$gamecontainer.querySelector('.ga')
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


        
    }

}