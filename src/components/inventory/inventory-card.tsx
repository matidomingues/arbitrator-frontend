import { Link, OrderParamsCodec } from "@imtbl/imx-sdk";
import { link } from "fs";
import { useState } from "react";
import { Tokens } from "../../api/interfaces";
import { cardData } from "../../configs/cards";
import { TokenBuyer } from "../../features/token-buyer/token-buyer";
import { IInventoryCard } from "../../repositories/interfaces";

interface IProps {
    card: IInventoryCard;
    link: Link;
}

export function InventoryCard(props: IProps) {

    const [price, setPrice] = useState(0);
    const [token, setToken] = useState(Tokens.ETH)

    const listCard = () => {
        if (token == Tokens.GODS) {
            props.link.sell({tokenAddress: props.card.ownerAddress, currencyAddress: '0xccc8cb5229b0ac8069c51fd58367fd1e622afd97' ,tokenId: props.card.tokenId, amount: price.toString()})
        } else {
            props.link.sell({tokenAddress: props.card.ownerAddress, tokenId: props.card.tokenId, amount: price.toString()})

        }
    }

    const renderBuy = () => {
        return (
            <div>
                <input type="number" onChange={e => setPrice(parseFloat(e.target.value))} />
                <button onClick={() => setToken(token === Tokens.ETH ? Tokens.GODS : Tokens.ETH)}>{token}</button>
                <button onClick={() => listCard()}>List</button>
            </div>
        )
    }

    const renderSale = () => {
        if (props.card.orders) {
            return(
                <div>
                    <span>{props.card.orders.ammount} {props.card.orders.currency}</span>
                </div>
            )
        }
        return null;
    }

    return (
        <div>
            <span>{props.card.tokenId}</span>
            {renderBuy()}
            {renderSale()}
        </div>
    )
}