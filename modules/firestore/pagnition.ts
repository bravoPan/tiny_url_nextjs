import { db } from "./db";
import { queryBatchReponse } from "../../pages/api/db/page/index";
import { prevDocsRef } from "../../pages/api/db/page/index";
import { Query,QueryDocumentSnapshot, DocumentData, query, collection, orderBy, startAfter, limit, getDocs, getCountFromServer,  } from "firebase/firestore";

export const pageNext = async (requestDocParam:prevDocsRef|null, maxPageNum:number=parseInt(process.env.MAX_RECORD_NUM as string)) => {
    let prevUrlDoc : null|QueryDocumentSnapshot<DocumentData>
    let prevCreationDoc : null|QueryDocumentSnapshot<DocumentData>
    
    // request on first index
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
        orderBy("shortID", "desc"),
        limit(maxPageNum));
    const urlDocumentSnapshots = await getDocs(curUrlQueryRef);
    
    // DEPRECATE: pagnition interface is not usable now.
    // Get the last visible URL document
    let lastUrlVisible = urlDocumentSnapshots.docs[0];

    // QUery the first batch page of creations
    const curCreationQueryRef = query(
        collection(db, "creation"),
        orderBy("shortID"),
        limit(maxPageNum));
    const creationDocumentSnapshots = await getDocs(curCreationQueryRef);

    // Get the last visible creation document
    let lastCreationVisible = creationDocumentSnapshots.docs[creationDocumentSnapshots.docs.length-1];
    
    // last page, return the same as param
    const urlCount = await getCountFromServer(collection(db, "url"))
    if (lastUrlVisible.data().shortID === urlCount.data().count-1){
        lastUrlVisible = prevUrlDoc as QueryDocumentSnapshot<DocumentData>
        lastCreationVisible = prevCreationDoc as QueryDocumentSnapshot<DocumentData>
    }

    let result:queryBatchReponse = {data: [], prevDocsRef: {urlDocRef: lastUrlVisible, creationDocRef: lastCreationVisible}}
    for(let i=0; i < urlDocumentSnapshots.docs.length; i++){
        const curUrlDocData = urlDocumentSnapshots.docs[i].data()
        const curCreationDocData = creationDocumentSnapshots.docs[i].data()
        // console.log(curUrlDocData.shortID === curCreationDocData.shortID)
        result.data.push({
            shortID: curUrlDocData.shortID,
            longURL: curUrlDocData.longurl,
            githubUserEmail: curCreationDocData.github_user_email,
            githubUserImageURL: curCreationDocData.github_user_image,
            githubUserName: curCreationDocData.github_user_name
        })
    }
    
    return result
}
