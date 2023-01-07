
import { querySnapshot, urlQuery } from "./modules/firestore/dataProcess";
import { NextRequest, NextResponse } from "next/server";
import { shortURLtoID } from "./modules/decrypt/decrypt";

export async function middleware(request: NextRequest) {
    const pathArray = request.nextUrl.pathname.split('/')
    if (pathArray.length !== 3)
        return NextResponse.redirect(new URL('/404', request.url))
    
    const shortURL = pathArray[pathArray.length-1]
    let [snapshot, _] = await urlQuery(shortURL)
    
    if (snapshot === null)
        return NextResponse.redirect(new URL('/404', request.url))
    
    snapshot = snapshot as querySnapshot
    // the length of snapshot is supposed to be 1 if found.
    const longURL = snapshot.urlQuerySnapshot.docs[0].data().longurl
    return NextResponse.redirect(new URL(longURL, request.url))
}

export const config = {
    matcher: '/s/:shortID*'
}