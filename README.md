# ![](./public/logo.png)
Not a big meal! Tidbit URL will make your url shorten and delicious 😋. A full stack short url web app implemented by nextjs framework. Follow the construction and make your own Turl app (free on vercel!).

## Demo
Visit https://turl-two.vercel.app and have fun!

## Tech Stack
- Lanuage: TS, JSX/TSX
- DB: Firebase
- Auth: next-auth, github oauth provider
- Unit Test: Jest
- UI: Next UI
- Redirection: nextjs middleware (due to vercel edge function limitation for free hosting, redirection can only be triggered 5s a time). Also check the url [matching order](https://nextjs.org/docs/advanced-features/middleware#matching-paths) for how it works.
- hosting: vercel
- algorithm: thanks to [geeksforgeeks](https://www.geeksforgeeks.org/how-to-design-a-tiny-url-or-url-shortener/)

## Configuration on Vercel
- `NEXTAUTH_URL`: v_domain/api/auth/callback/github
- `NEXTAUTH_SECRET`: create one by openssl 32, according to vercel [depolyment instruction](https://next-auth.js.org/configuration/options#secret), this is required to set in your code.
- `MAX_RECORD_NUM`: max record can have in one page (20 is in demo)
- `FIREBASE_MEASUREMENTED`
- `FIREBASE_APPID`
- `FIREBASE_MESSAGINGSENDERID`
- `FIREBASE_STORAGEBUCKET`
- `FIREBASE_PROJECTID`
- `FIREBASE_AUTHDOMAIN`
- `FIREBASE_APIKEY`: create your firebase app and you'll find it (be sure to creating in producation mode in firebase)
- `GITHUB_SECRET`
- `GITHUB_ID`: create your github oauth app, they'll show you.

Also, do not forget to configure on Github Oauth Page.
- `HomePage URL`: vercel domain
- `Authorization callback URL`: v_domain/api/auth/callback/github

## Test
In you are in dev mode, confige the environment variables below, and run 

`
npm install
`

to install dependency, then

`
npm run dev
`

to start developing on locahost and 

`npm test`

to run Jest test cases.

