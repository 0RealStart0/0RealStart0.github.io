export const reqRandomWord = async(count)=>{
    try{
        let data = await fetch('/data/word.json');
        data = await data.json();
        // console.log(data.word);
        const num = data.word.length;

        const set = new Set();

        for(;set.size<count;){
            set.add(data.word[Math.floor(Math.random()*num)]);
        }

        return [...set];

    }catch(e){
        console.log(e);
    }
}