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
            // console.log('빠~',progerssBar.style.width)
        }
        // console.log('인터벌', minutes, seconds);
        if (time === 0) {
            clearInterval(interval);
            fnc(this.$record);
        }
    }, 1000);

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

export function phase1Helper(color, groupLength){
    let tdSet = Array.from(Array(groupLength), () => new Array());
    [...this.$gamecontainer.getElementsByTagName('td')].forEach((td) => {
        tdSet[td.dataset.group].push(td);
    });
    groupColorChange(tdSet, 0, 0, color);

    this.$gamecontainer.querySelector('.practice-arrow').addEventListener('click',arrowBtnEvent(groupLength,tdSet,color));

    let $progress = this.$gamecontainer.querySelector('.game-status');
    let interval = timer.bind(this)(this.data.setting.ready, $progress, this.phase2.bind(this));
    $progress.querySelector('.btn').addEventListener('click', (e) => {
        clearInterval(interval);
        this.phase2();
    });

}