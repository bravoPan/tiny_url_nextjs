# Turl
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

## Configuration
- Firebase SDK on firebase page
- Github ID&Secre
- Github Oauth Page
  - HomePage URL: vercel domain
  - Authorization callback URL: v_domain/api/auth/callback/github
- NEXTAUTH_URL: v_domain/api/auth
- NEXTAUTH_SECRET: according to vercel [depolyment instruction](https://next-auth.js.org/configuration/options#secret), this is required to set in your code.

## Test
Once configed the approprite environment variables, run 

`
npm run dev
`

to start developing on locahost and 

`npm test`

to run Jest test cases.
