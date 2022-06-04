export const reqRandomWord = async(count)=>{
    try{
        let data = await fetch('/data/word.json');
        data = await data.json();
        // console.log(data.word);
        const num = data.length;

        const set = new Set();

        for(;set.size<count;){
            set.add(data[Math.floor(Math.random()*num)]);
        }

        return [...set];

    }catch(e){
        console.log(e);
    }
}
export const reqRandomImage = async(count)=>{
    try{
        let data = await fetch('/data/emoji.json');
        data = await data.json();
        // console.log(data.word);
        const num = data.length;

        const set = new Set();

        for(;set.size<count;){
            set.add(data[Math.floor(Math.random()*num)]);
        }

        return [...set];

    }catch(e){
        console.log(e);
    }
}