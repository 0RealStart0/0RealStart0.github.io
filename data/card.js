const num = ['2','3','4','5','6','7','8','9','10','J','Q','K','A'];
const shape = ['♠','♥','♣','◆'];

export const randomCard = () =>{
    let arr = [];
    for(let s of shape){
        for(let n of num){
            arr.push(n+s);
        }
    }

    let m = arr.length;

    let index;
    while(m){
        index = Math.floor(Math.random()*m--);
        [arr[m],arr[index]] = [arr[index],arr[m]];
    }
    return arr;
}


export const getCardSet = ()=>{
    let arr = Array.from(Array(4),()=>new Array());
    for(let i in shape){
        for(let n of num){
            arr[i].push(n+shape[i]);
        }
    }
    return arr;
}

