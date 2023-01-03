import { shortURLtoID } from  "../modules/decrypt/decrypt"
import { idToLongURL } from "../modules/encrypt/encrypt";

/**
 * Cross validation for functions shortURLtoID and idToLongURL,
 * 3 digits based with 73 url char array is qualified to ensure
 * the correctness.
 */
test('three digits shortURL cross validation', () => {
    let tests = []
    for(let i = 0; i < Math.pow(73, 3); i++) {
        tests.push({input: i, expected: i})
    }

    // cross validtion encryption and decryption.
    tests.forEach((test)=>{
        expect(shortURLtoID(idToLongURL(test.input))).toBe(test.expected);
    })
});