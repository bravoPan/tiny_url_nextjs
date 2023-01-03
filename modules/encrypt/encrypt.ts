/**
 * Creates a unique number id for the long url.
 * @param id number of records in database.
 * @returns A string as the short URL.
 */
export const idToLongURL = (id:number) => {
    const urlMap = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789$-_.+!*'(),"
    let shortURL = []
    
    while(id > 0){
        shortURL.push(urlMap[id % 73]);
        id = Math.floor(id/73);
    }

    shortURL.reverse();
    return shortURL.join("");
}
