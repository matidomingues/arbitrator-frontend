import { Link } from "@imtbl/imx-sdk";
import { useState } from "react";
import { Tokens } from "../../api/interfaces";
import { IInventoryCard } from "../../repositories/interfaces";
import godsSrc from '../../assets/gods.png';
import ethSrc from '../../assets/eth.png'
import imxSrc from '../../assets/imx.png'
import usdcSrc from '../../assets/usdc.png'
import gogSrc from '../../assets/gog.png'

import './inventory.css'

interface IProps {
    card: IInventoryCard;
    link: Link;
}

export enum TokenToAddress {
    IMX = '0xf57e7e7c23978c3caec3c3548e3d615c346e79ff',
    GODS = '0xccc8cb5229b0ac8069c51fd58367fd1e622afd97',
    USDC = '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48',
    GOG = '0x9ab7bb7fdc60f4357ecfef43986818a2a3569c62'
}



export function InventoryCard(props: IProps) {

    const [price, setPrice] = useState(0);
    const [token, setToken] = useState(Tokens.ETH)

    const tokenToAddress = (token: Tokens) => {
        switch(token) {
            case Tokens.IMX: return TokenToAddress.IMX;
            case Tokens.GODS: return TokenToAddress.GODS;
            case Tokens.USDC: return TokenToAddress.USDC;
        }
    }

    const listCard = () => {
        if (token !== Tokens.ETH) {
            props.link.sell({tokenAddress: props.card.ownerAddress, currencyAddress: tokenToAddress(token) ,tokenId: props.card.tokenId, amount: price.toString()})
        } else {
            props.link.sell({tokenAddress: props.card.ownerAddress, tokenId: props.card.tokenId, amount: price.toString()})

        }
    }

    const getTokenImage = (token: Tokens) => {
        switch(token) {
            case Tokens.GODS: return <img src={godsSrc} width={16} />;
            case Tokens.ETH: return <img src={ethSrc} width={16} />;
            case Tokens.IMX: return <img src={imxSrc} width={16} />;
            case Tokens.USDC: return <img src={usdcSrc} width={16} />;
            case Tokens.GOG: return <img src={gogSrc} width={16} />
        }
    }

    const getNextTokenType = (token: Tokens) => {
        switch(token) {
            case Tokens.ETH: return Tokens.GODS;
            case Tokens.GODS: return Tokens.IMX;
            case Tokens.IMX: return Tokens.USDC;
            case Tokens.USDC: return Tokens.ETH;
        }
        return Tokens.ETH
    }

    const renderBuy = () => {
        return (
            <div>
                <input type="number" placeholder="Price to list"onChange={e => setPrice(parseFloat(e.target.value))} />
                <button onClick={() => setToken(getNextTokenType(token))}>{getTokenImage(token)}</button>
                <button onClick={() => listCard()}>List</button>
            </div>
        )
    }

    const renderVariety = () => {
        switch(props.card.variation){
            case '4': return 'Meteorite';
            case '3': return'Shadow';
            case '2': return'Gold';
            case '1': return 'Diamond';
        }
    }

    return (
        <div className="listing-container">
            <div>
                <span>{props.card.tokenId} - {renderVariety()}</span>
                <span> - </span>
                {props.card.orders ? <span>Listed for {props.card.orders.ammount} {props.card.orders.currency}</span> : <span>Not listed</span>}
            </div>
            {renderBuy()}
        </div>
    )
}