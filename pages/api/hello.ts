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
import {urlGetBatch} from "../../modules/firestore/dataProcess"

export default async function handler(req:any, res:any){
  for(let i = 0; i < 12;){
    const test = await urlGetBatch(i, 2)
    console.log("for index ", i)
    console.log(test)
    i+=2
  }
}