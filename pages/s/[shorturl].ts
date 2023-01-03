import { useRouter } from "next/router"


export default function RedirectToLong(){
    const router = useRouter()
    const {shorturl} = router.query

    return `<p>${shorturl}</p>`
}