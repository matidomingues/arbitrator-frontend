import { Link } from "@imtbl/imx-sdk";
import {useSearchParams } from "react-router-dom";
import { Tokens } from "../../api/interfaces";
import { TokenToAddress } from "../../components/inventory/inventory-card";

export interface IProps {
}


const tokenToAddress = (token: Tokens) => {
    switch(token) {
        case Tokens.IMX: return TokenToAddress.IMX;
        case Tokens.GODS: return TokenToAddress.GODS;
        case Tokens.USDC: return TokenToAddress.USDC;
    }
}

export function ListApp(props: IProps) {
    const [search] = useSearchParams();
    const link = new Link('https://link.x.immutable.com');

    const amount = search.get('price');
    const tokenId = search.get('tokenId');
    const currency = search.get('currency');
    const address = '0xacb3c6a43d15b907e8433077b6d38ae40936fe2c';



    if (amount && tokenId && currency) {
        link.sell({tokenAddress: address, tokenId, amount, currencyAddress: tokenToAddress(currency as Tokens)});
    }

    return (
        <div />
    )
}