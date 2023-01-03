/**
 * Returns the db id for the shortURL.
 * @param shortURL Decode the shortURL to database id.
 * @returns An unique number id.
 */
export const shortURLtoID = (shortURL:string) => {

    let id:number = 0;
    const speicalCharArr = "$-_.+!*'(),".split('');
    
    for (let i = 0; i < shortURL.length+1; i++){
        if ('a' <= shortURL[i] && shortURL[i] <= 'z')
            id = id*73 + shortURL[i].charCodeAt(0) - 'a'.charCodeAt(0);
        if ('A' <= shortURL[i] && shortURL[i] <= 'Z')
            id = id*73 + shortURL[i].charCodeAt(0) - 'A'.charCodeAt(0) + 26;
        if ('0' <= shortURL[i] && shortURL[i] <= '9')
            id = id*73 + shortURL[i].charCodeAt(0) - '0'.charCodeAt(0) + 52;
        if (speicalCharArr.includes(shortURL[i])){
            id = id*73 + speicalCharArr.indexOf(shortURL[i]) + 62;
        }
    }
    return id;
}