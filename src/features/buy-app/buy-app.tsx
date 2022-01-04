import { Link } from "@imtbl/imx-sdk";
import { useParams } from "react-router-dom";

export interface IProps {
}

export function BuyApp(props: IProps) {
    let params = useParams();
    const orderId = params.orderId;
    const link = new Link('https://link.x.immutable.com');

    if (orderId) {
        link.buy({orderIds: [orderId]});
    }

    return (
        <div />
    )
}