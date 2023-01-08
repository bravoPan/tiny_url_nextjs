import { Text } from "@nextui-org/react"

export const HeaderTitleText = () => {
    return (<Text
        h1
        size={60}
        css={{
            textGradient: "45deg, $blue600 -20%, $pink600 50%",
        }}
        weight="bold">
        Shorten Your Loooooong URL
    </Text>)
}