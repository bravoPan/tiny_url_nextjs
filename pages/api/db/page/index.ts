import { queryReponse } from ".."
import { pageNext } from "../../../../modules/firestore/pagnition"
import { QueryDocumentSnapshot, DocumentData } from "firebase/firestore"

export type prevDocsRef = {
    urlDocRef: QueryDocumentSnapshot<DocumentData>,
    creationDocRef: QueryDocumentSnapshot<DocumentData>
  }  

export type queryBatchReponse = {
    prevDocsRef: prevDocsRef,
    data: queryReponse[]
}
  
export default async function handler(req:any, res:any){
  if (req.method === "POST") {
    const { prevDocRef } = req.body
    const nextPage = await pageNext(prevDocRef)
    res.status(200).json(nextPage)
  } else {
    res.status(401).json('unsupported method')
  }
}