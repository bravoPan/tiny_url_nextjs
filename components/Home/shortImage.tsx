import Image from "next/image";
import { Session } from "next-auth";

export const ShortRow = (gitHubSession:Session) => {
    const userImage = gitHubSession.user?.image as string;
    return <Image src={userImage} width={200} height={200} alt="github user image"/>
}