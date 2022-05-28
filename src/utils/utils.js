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

