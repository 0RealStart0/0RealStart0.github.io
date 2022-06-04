import { setting, ready, memory, recall, result }  from '../components/game_components.js'

export const groupColor = 'var(--group-color)'

export function show() {
    const { timeShow, graphShow } = this.data.setting;
    if (timeShow) {
        this.$gamecontainer.querySelector('.memory-time').style.visibility = 'hidden';
    }
    if (graphShow) {
        this.$gamecontainer.querySelector('.progress-bar').style.display = 'none';

    }
}

export function timer(time, $element, fnc) {
    let hurryFlag = false;
    let minutes = Math.floor(time / 60);
    let seconds = time % 60;
    let startTime = time;

    let $timeSpan = $element.querySelector('.time-num');
    $timeSpan.innerHTML = '';
    $timeSpan.textContent = `${minutes < 10 ? '0' + minutes : minutes}:${seconds < 10 ? '0' + seconds : seconds}`;

    let $progerssBar = $element.querySelector('.progress-bar-filled');
    // let $progerssBarArrow = $element.querySelector('.progress-bar-filled::before');
    let interval = setInterval(() => {
        time -= 1;
        minutes = Math.floor(time / 60);
        seconds = time % 60;
        
        // console.log('실행됨?')
        if (!hurryFlag && time<=60) {
            hurryFlag = true;
            
            if($progerssBar){
                $progerssBar.style.backgroundColor = '#F74603';
            }
            // $progerssBarArrow.style.backgroundColor = '#F74603';
            if ($timeSpan.parentNode.className === 'memory-time') {
                $timeSpan.style.color = '#F74603';
            }
            
        }
        
        $timeSpan.textContent = `${minutes < 10 ? '0' + minutes : minutes}:${seconds < 10 ? '0' + seconds : seconds}`;
        
        
        if ($progerssBar) {
            $progerssBar.style.width = Math.round((time / startTime) * 10000) / 100 + '%';
        }
        if (time === 0) {
            clearInterval(interval);
            fnc(this.$record);
        }
    }, 1000);
    
    // console.log('1')
    return interval;
}

export function groupColorChange(tdSet, now, before, color) {

    tdSet[now].forEach((td) => {
        td.style.backgroundColor = color;
    });
    if (now !== before) {
        tdSet[before].forEach((td) => {
            td.removeAttribute('style');
        });
    }
}

export function elementColorChange(tdSet, now, before, color) {

    tdSet[now].style.backgroundColor = color;
    
    if (now !== before) {
        tdSet[before].removeAttribute('style');
    }
}

export function arrowBtnEvent(groupLength, tdSet, color) {
    let now = 0;
    if(!color) color = 'white'
    return (e) => {
        if (e.target.nodeName !== 'BUTTON') return;
        const move = parseInt(e.target.dataset.move);
        if (move === 0 || now + move < 0 || now + move >= groupLength) {
            groupColorChange(tdSet, 0, now, color);
            now = 0;
        } else {
            groupColorChange(tdSet, now + move, now, color);
            now = now + move;

        }
    }
}

export function phase1Helper(color, groupLength, name){
    let tdSet = Array.from(Array(groupLength), () => new Array());
    [...this.$gamecontainer.getElementsByTagName('td')].forEach((td) => {
        tdSet[td.dataset.group].push(td);
    });
    groupColorChange(tdSet, 0, 0, color);
    this.$gamecontainer.querySelector('.practice-arrow').addEventListener('click',arrowBtnEvent(groupLength,tdSet,color));

    let $progress = this.$gamecontainer.querySelector('.game-status');
    let interval = timer.bind(this)(this.data.setting.ready, $progress, phase2.bind(this));
    $progress.querySelector('.btn').addEventListener('click', (e) => {
        clearInterval(interval);
        phase2.bind(this)();
    });
    function phase2() {
    
        const tpl = document.createElement('template');
        tpl.innerHTML = memory;
        const fragment = tpl.content;
    
        this.$gamecontainer.replaceChild(fragment, this.$gamecontainer.querySelector('.game-status'));
        this.$gamecontainer.querySelector(`.table-container.${name}`).style.visibility = 'visible';
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
}

export function phase3Helper(record){
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
