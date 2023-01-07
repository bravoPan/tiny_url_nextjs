import { db } from "./db"
import { shortURLtoID } from "../decrypt/decrypt"
// import { prevDocsRef,queryBatchReponse } from "../../pages/api/db/page/index"
// import { queryReponse } from "../../pages/api/db/page/index"
import { limit, orderBy, collection, addDoc, getCountFromServer, query, where, getDoc, getDocs, QuerySnapshot, startAfter, QueryDocumentSnapshot, DocumentData, limitToLast } from 'firebase/firestore'

export type githubInfo = {
    githubUserName: string,
    githubUserEmail: string,
    githubUserImageURL: string
}

export type querySnapshot = {
    urlQuerySnapshot: QuerySnapshot,
    creationQUerySnapshot: QuerySnapshot
}

export enum firebaseApiStats {
    // STORE status code
    STORE_SUCCESS,
    URL_STORE_ERROR,
    CREATION_STORE_ERROR,
    URL_STORE_EXISTED,
    STORE_UNDEFINED,

    // Query status code
    QUERY_FOUND,
    QUERY_URL_NOT_FOUND,
    QUERY_CREATION_NOT_FOUND,
    QUERY_UNDEFINED
}

export const store = async (longURL:string, githubData:githubInfo) => {
    try {
        // first query to check longURL not in db
        // const shortID = shortURLtoID(longURL)
        const urlRef = collection(db, "url")
        const qRef = query(urlRef, where("longurl", "==", longURL))
        
        const urlQuerySnapshot = await getDocs(qRef)
        if (urlQuerySnapshot.docs.length !== 0) {
            return firebaseApiStats.URL_STORE_EXISTED
        }

        const urlCount = await getCountFromServer(urlRef)
        const urlDocRef = await addDoc(collection(db, "url"), {
          longurl: longURL,
          shortID: urlCount.data().count
        });

        if (urlDocRef === null)
            return firebaseApiStats.URL_STORE_ERROR

        const usersDocRef = await addDoc(collection(db, "creation"), {
          github_user_email: githubData.githubUserEmail,
          github_user_image: githubData.githubUserImageURL,
          github_user_name: githubData.githubUserName,
          shortID: urlCount.data().count
        })

        if (usersDocRef === null)
            return firebaseApiStats.CREATION_STORE_ERROR

        return firebaseApiStats.STORE_SUCCESS
      } catch (e) {
        return firebaseApiStats.STORE_UNDEFINED
      }
}

export const urlQuery = async (shortURL:string) => {
    try {
        const shortID = shortURLtoID(shortURL)
        // query url collection
        const urlRef = collection(db, "url")
        const qRef = query(urlRef, where("shortID", "==", shortID))
        
        // 0 data found for url collection
        const urlQuerySnapshot = await getDocs(qRef)
        if (urlQuerySnapshot.docs.length === 0) {
            return [null, firebaseApiStats.QUERY_URL_NOT_FOUND]
        }
            
        // query creation collection
        const creationRef = collection(db, "creation")
        const cRef = query(creationRef, where("shortID", "==", shortID))
        
        // 0 data found for creation collection
        const creationQuerySnapshot = await getDocs(cRef)
        if (creationQuerySnapshot.docs.length === 0) {
            return [null, firebaseApiStats.QUERY_CREATION_NOT_FOUND]
        }

        const data:querySnapshot = {urlQuerySnapshot: urlQuerySnapshot, creationQUerySnapshot:creationQuerySnapshot}
        return [data, firebaseApiStats.QUERY_FOUND]
    } catch (e) {
        return [null, firebaseApiStats.QUERY_UNDEFINED]
    }
}