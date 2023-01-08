import { queryReponse } from "../../pages/api/db";
import { Card, Grid, Text, Link } from "@nextui-org/react";
import { idToLongURL } from "../../modules/encrypt/encrypt";


export const UrlRow = (props: { data: queryReponse[] }) => {
  return (
    <div style={{ marginTop: "20px" }}>
      {props.data.map((x) => {
        return (
          <div style={{ marginBottom: "20px" }} key={x.shortID}>
            <Card isHoverable isPressable css={{ p: "$6", mw: "90%" }}>
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
                <Link block href={"/s/" + idToLongURL(x.shortID)} css={{ fontSize: "20px" }}>
                turl-two.vercel.app/{idToLongURL(x.shortID)}
                </Link>

              </Card.Body>
              <Card.Footer>
                <Text size="$md">
                  {x.longURL}
                </Text>
              </Card.Footer>
            </Card>
          </div>
        )
      })}
    </div>
  )
}

