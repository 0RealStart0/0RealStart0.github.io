export const setting = (keyword)=>{ 
    return `
<div class="setting-fieldset">
<form>
    <fieldset>
        <legend>${keyword} 설정</legend>
        <div class="form-group">
            <label style="width: 1.5em">그룹 갯수 - </label>
            <select name="group">
                <option value="1">1</option>
                <option value="2">2</option>
                <option value="3">3</option>
                <option value="4">4</option>
                <option value="5">5</option>
                <option value="6">6</option>
                <option value="7">7</option>
                <option value="8">8</option>
                <option value="9">9</option>
                <option value="10">10</option>
            </select>
        </div>
        <div class="form-group">
            <label>준비 시간 - </label>
            <select name="ready">
                <option value="5">5초</option>
                <option value="10">10초</option>
                <option value="15">15초</option>
                <option value="20">20초</option>
                <option value="25">25초</option>
                <option value="30">30초</option>
            </select>
        </div>
        <div class="form-group">
            <label>타이머 숨기기 - </label>
            <label><input type="checkbox" name="num"> 숫자</label>
            <label><input type="checkbox" name="graph"> 그래프</label>
        </div>
        <button class="btn btn-primary" type="submit">시작하기</button>
    </fieldset>
</form>
</div>`}

// time.padStart(2,'0')
export const ready =`
<div class="game-status">
    <button class="btn btn-primary">시작</button>
    <div class="ready-time">
        <span>준비 시간 - </span>
        <span class="time-num"></span>
    </div>
</div>`

export const memory = `
<div class="game-status">
    <button class="btn btn-primary">완료</button>
    <div class="progress-bar">
        <div class="progress-bar-filled" style="width: 100%"></div>
    </div>
    <div class="memory-time">
        <span>남은 시간 - </span>
        <span class="time-num"></span>
    </div>
</div>`;

export const recall = `
<div class="game-status">
    <button class="btn btn-primary">완료</button>
    <div class="progress-bar">
        <div class="progress-bar-filled" style="width: 40%"></div>
    </div>
    <div>
        <span>남은 시간 - </span>
        <span class="time-num"></span>
    </div>
</div>`;

export const result = `
<div class="game-status">
    <button class="btn btn-primary">확인</button>
</div>`;