import { queryReponse } from "../../pages/api/db";
import { Card, Grid, Text, Link } from "@nextui-org/react";
import { idToLongURL } from "../../modules/encrypt/encrypt";


export const UrlRow = (props:{data:queryReponse[]}) => {
  const nextURL = process.env.NEXTAUTH_URL
  console.log(nextURL)
    return (
        <div>
        {props.data.map((x)=>{
            return (
        <div style={{ marginBottom: "20px" }} key={x.shortID}>
        <Card isHoverable isPressable css={{ p: "$6", mw: "800px" }}>
        <Card.Header>
          <img
            alt="nextui logo"
            src={x.githubUserImageURL}
            width="40px"
            height="40px"
          />
          <Grid.Container css={{ pl: "$6" }}>
            <Grid xs={12}>
              <Text h4 css={{ lineHeight: "$xs" }}>
               {x.githubUserName}
              </Text>
            </Grid>
            <Grid xs={12}>
              <Text css={{ color: "$accents8" }}>{x.githubUserEmail}</Text>
            </Grid>
          </Grid.Container>
        </Card.Header>
        <Card.Body css={{ py: "$2" }}>
          <Text size="$2xl">
          localhost:3000/{idToLongURL(x.shortID)}
          </Text>
        </Card.Body>
        <Card.Footer>
          <Link
            color="primary"
            target="_blank"
            href="https://github.com/nextui-org/nextui"
          >
            {x.longURL}
          </Link>
        </Card.Footer>
      </Card>
      </div>
            )
        })}
        </div>
    )
}