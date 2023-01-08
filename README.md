# tiny_url_nextjs
A full stack short url website implemented by nextjs framework. Please visit https://turl-two.vercel.app and have fun!

## Tech Stack

- Lanuage: TS, JSX/TSX
- DB: Firebase
- Auth: next-auth, github oauth provider
- Unit Test: Jest
- UI: Next UI
- Redirection: nextjs middleware (due to vercel edge function limitation for free hosting, redirection can only be triggered 5s a time). Also check the url [matching order](https://nextjs.org/docs/advanced-features/middleware#matching-paths) for how it works.
- hosting: vercel
- algorithm: thanks to [geeksforgeeks](https://www.geeksforgeeks.org/how-to-design-a-tiny-url-or-url-shortener/)

## Config on Vercel
- Firebase SDK
- Github ID&Secre
- Github Oauth Page
  - HomePage URL: vercel domain
  - Authorization callback URL: v_domain/api/auth/callback/github
- NEXTAUTH_URL: v_domain/api/auth
- NEXTAUTH_SECRET: according to vercel [depolyment instruction](https://next-auth.js.org/configuration/options#secret), this is required to set in your code.
