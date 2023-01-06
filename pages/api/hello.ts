// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
// import type { NextApiRequest, NextApiResponse } from 'next'

// type Data = {
//   name: string
// }

// export default function handler(
//   req: NextApiRequest,
//   res: NextApiResponse<Data>
// ) {
//   res.status(200).json({ name: 'John Doe' })
// }

// import { queryBatchReponse } from "./db";
import { urlGetBatch } from "../../modules/firestore/dataProcess"
import { prevDocsRef, queryBatchReponse } from "./db/index"
  // experiment query
  

export default async function handler(req:any, res:any){
  const curBatch = await urlGetBatch(null, 2)

  const lastDocsRef = curBatch.prevDocsRef
  const nextBatch = await urlGetBatch(lastDocsRef, 2)

  // next next batch
  const lastLastDocsRef = nextBatch.prevDocsRef
  const nextnextBatch = await urlGetBatch(lastLastDocsRef, 2)
  console.log(nextnextBatch)
}