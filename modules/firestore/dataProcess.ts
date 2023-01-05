import { db } from "./db"
import { shortURLtoID } from "../decrypt/decrypt"
import { queryReponse, queryBatchReponse } from "../../pages/api/db"
import { collection, addDoc, getCountFromServer, query, where, getDoc, getDocs, QuerySnapshot } from 'firebase/firestore'

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
        // search first to check whether in database
        const shortID = shortURLtoID(longURL)
        const urlRef = collection(db, "url")
        const qRef = query(urlRef, where("shortID", "==", shortID))
        
        const urlQuerySnapshot = await getDocs(qRef)
        if (urlQuerySnapshot.docs.length !== 0) {
            return firebaseApiStats.URL_STORE_EXISTED
        }

        const urlDocRef = await addDoc(collection(db, "url"), {
          longurl: longURL,
          shortID: shortID
        });

        if (urlDocRef === null)
            return firebaseApiStats.URL_STORE_ERROR

        const usersDocRef = await addDoc(collection(db, "creation"), {
          github_user_email: githubData.githubUserEmail,
          github_user_image: githubData.githubUserImageURL,
          github_user_name: githubData.githubUserName,
          shortID: shortID
        })

        if (usersDocRef === null)
            return firebaseApiStats.CREATION_STORE_ERROR

        return firebaseApiStats.STORE_SUCCESS
      } catch (e) {
        return firebaseApiStats.STORE_UNDEFINED
      }
}

export const urlQuery = async (longURL:string) => {
    try {
        const shortID = shortURLtoID(longURL)
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

export const urlGetBatch = async (index:number, maxPageNum:number=parseInt(process.env.MAX_RECORD_NUM as string)) => {
    const urlRef = collection(db, 'url')
    const urlSnapshot = await getCountFromServer(urlRef)
    const urlCnt = urlSnapshot.data().count
    const urlDocsRef = await getDocs(urlRef)

    const creationRef = collection(db, 'creation')
    const creationDocsRef = await getDocs(creationRef)

    index = index < 0 ? 0 : index

    let nextIndex = index+1
    let endIdx = (index+1) * maxPageNum
    if (endIdx > urlCnt) {
        endIdx = urlCnt
        nextIndex = index
    }

    let resultData:queryReponse[] = []

    // for(let i=index*maxPageNum; i < endIdx; i++){
    //     const curUrlDocData = urlDocsRef.docs[i].data()
    //     const curCreationDocData = creationDocsRef.docs[i].data()
    //     resultData.push({
    //         longURL: curUrlDocData.longurl,
    //         githubUserEmail: curCreationDocData.github_user_email,
    //         githubUserImageURL: curCreationDocData.github_user_image,
    //         githubUserName: curCreationDocData.github_user_name
    //     })
    // }

    let result:queryBatchReponse = {data:resultData, nextIndex:nextIndex}
    return result
}
