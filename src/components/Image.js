import { setting, ready, memory, recall, result } from "./game_components.js";
import { show, timer, groupColorChange, arrowBtnEvent, elementColorChange } from "../utils/utils.js";

export default class Image{
    constructor($parent) {
        this.$parent = $parent;
        this.$parent.innerHTML = '';
        this.render();

        this.$record;
        this.data = {};

        this.$gamecontainer = document.createElement('div');
        this.$gamecontainer.className = 'game-container image';
    }

    render(){
        this.$parent.innerHTML = setting('랜덤 이미지');
        [...this.$parent.querySelectorAll('.form-group')].forEach((div)=>{
            div.style.visibility = 'hidden';
        })
        this.$parent.querySelector('.btn').textContent = '준비중입니다...';
        this.$parent.querySelector('.setting-fieldset').addEventListener('submit', async (e) => {
            e.preventDefault();
            alert('준비중입니다...');
        })
        

    }

}