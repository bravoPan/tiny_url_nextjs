import { QuerySnapshot } from "firebase/firestore";
// import querySnapshot from "../../../modules/firestore/dataProcess"
import { firebaseApiStats, querySnapshot, store, urlQuery } from "../../../modules/firestore/dataProcess";
import { DocumentData, QueryDocumentSnapshot } from 'firebase/firestore'

export type queryReponse = {
  longURL: string,
  githubUserName: string,
  githubUserEmail: string,
  githubUserImageURL: string
}

export type prevDocsRef = {
  urlDocRef: QueryDocumentSnapshot<DocumentData>,
  creationDocRef: QueryDocumentSnapshot<DocumentData>
}

export type queryBatchReponse = {
  prevDocsRef: prevDocsRef,
  data: queryReponse[]
}

export default async function handler(req:any, res:any){
  if (req.method === 'POST' ) {
    const {longURL, githubData} = req.body
    const firebaseStoreStats = store(longURL, githubData)
    res.status(201).json(firebaseStoreStats)
  }
  else if (req.method === 'GET') {
    const { longURL } = req.query
    const [data, firebaseQueryStats] = await urlQuery(longURL)
    if (data === null){
      res.status(401).json('query data not found, errCode:', firebaseQueryStats)
      return
    }

    let {urlQuerySnapshot, creationQUerySnapshot} = data as querySnapshot

    // it is ensured only one long url record will be found.
    const urlQueryRecord = urlQuerySnapshot.docs.map(x => x.data())[0]
    const creationQueryRecord = creationQUerySnapshot.docs.map(x => x.data())[0]
    const reponse:queryReponse = {
      longURL: urlQueryRecord.longurl,
      githubUserEmail: creationQueryRecord.github_user_email,
      githubUserImageURL: creationQueryRecord.github_user_image,
      githubUserName: creationQueryRecord.github_user_name
    }
    res.status(200).json(reponse)
  } 
  else {res.status(403).json('unsupported request method')}
}
