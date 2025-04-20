import { CardBody, CardFooter, CardHeader, CardRoot, Heading, Separator, Text } from "@chakra-ui/react"
import moment from "moment";

export default function Note({ title, description, createdAt }) {
    return (
    <CardRoot variant={"subtle"}>
        <CardHeader>
            <Heading size={"3xl"} fontWeight={"bold"}>{title}</Heading>
        </CardHeader>
        <Separator variant={"solid"} height={"1px"} backgroundColor={"gray"}/>
        <CardBody>
            <Text>{description}</Text>
        </CardBody>
        <Separator variant={"solid"} height={"1px"} backgroundColor={"gray"} />
        <CardFooter>
            {moment(createdAt).format("DD/MM/YYYY hh.mm.ss")}
        </CardFooter>
    </CardRoot>
    )
}
