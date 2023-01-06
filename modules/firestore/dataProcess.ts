import { db } from "./db"
import { shortURLtoID } from "../decrypt/decrypt"
import { queryReponse, queryBatchReponse, prevDocsRef } from "../../pages/api/db"
import { limit, orderBy, collection, addDoc, getCountFromServer, query, where, getDoc, getDocs, QuerySnapshot, startAfter, QueryDocumentSnapshot, DocumentData } from 'firebase/firestore'

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

export const urlGetBatch = async (requestDocParam:prevDocsRef|null, maxPageNum:number=parseInt(process.env.MAX_RECORD_NUM as string)) => {
    let prevUrlDoc : null|QueryDocumentSnapshot<DocumentData>
    let prevCreationDoc : null|QueryDocumentSnapshot<DocumentData>
    
    if (requestDocParam === null) 
        prevUrlDoc = prevCreationDoc = null;
    else{
        const {urlDocRef, creationDocRef } = requestDocParam as prevDocsRef
        prevUrlDoc = urlDocRef
        prevCreationDoc = creationDocRef
    }
        
    // Query the first batch page of docs
    const curUrlQueryRef = query(
        collection(db, "url"),
        orderBy("shortID"),
        startAfter(prevUrlDoc),
        limit(maxPageNum));
    const urlDocumentSnapshots = await getDocs(curUrlQueryRef);

    // Get the last visible URL document
    const lastUrlVisible = urlDocumentSnapshots.docs[urlDocumentSnapshots.docs.length-1];

    // QUery the first batch page of creations
    const curCreationQueryRef = query(
        collection(db, "creation"),
        orderBy("shortID"),
        startAfter(prevCreationDoc),
        limit(maxPageNum));
    const creationDocumentSnapshots = await getDocs(curCreationQueryRef);

    // Get the last visible creation document
    const lastCreationVisible = creationDocumentSnapshots.docs[creationDocumentSnapshots.docs.length-1];
    
    let result:queryBatchReponse = {data: [], prevDocsRef: {urlDocRef: lastUrlVisible, creationDocRef: lastCreationVisible}}
    for(let i=0; i < urlDocumentSnapshots.docs.length; i++){
        const curUrlDocData = urlDocumentSnapshots.docs[i].data()
        const curCreationDocData = creationDocumentSnapshots.docs[i].data()
        console.log(curUrlDocData.shortID === curCreationDocData.shortID)
        result.data.push({
            longURL: curUrlDocData.longurl,
            githubUserEmail: curCreationDocData.github_user_email,
            githubUserImageURL: curCreationDocData.github_user_image,
            githubUserName: curCreationDocData.github_user_name
        })
    }
    
    return result
}
