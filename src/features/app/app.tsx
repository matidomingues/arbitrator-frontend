import { Outlet, useNavigate, useOutletContext, useParams } from "react-router-dom";
import './app.css';

import godsSrc from '../../assets/gods.png';
import ethSrc from '../../assets/eth.png'
import { PriceRepo } from "../../repositories/price-repo";
import { useEffect, useState } from "react";
import { Tokens } from "../../api/interfaces";
import { Link } from "@imtbl/imx-sdk";
import { ImmutableRepo } from "../../repositories/immutable-repo";
import { GodsRepo } from "../../repositories/gods-repo";

interface IProps {
    priceRepo: PriceRepo;
    immutableRepo: ImmutableRepo;
    godsRepo: GodsRepo;
}

type ContextType = { wallet: string | null, ethPrice: number, godsPrice: number, imxPrice: number };

export function App(props: IProps) {

    let params = useParams();
    const cardId = parseInt(params.cardId || '0');
    const variation = parseInt(params.variationId || '0');

    const [ethPrice, setEthPrice] = useState(0);
    const [godsPrice, setGodsPrice] = useState(0);
    const [imxPrice, setImxPrice] = useState(0);
    const [wallet, setWallet] = useState(localStorage.getItem('address'));
    const [cardName, setCardName] = useState('');

    const getCardName = async () => {
        let card = props.immutableRepo.fetchCard(cardId, variation);
        if (card) {
            setCardName(card.name);
        } else {
            setCardName(await (await props.godsRepo.getCard(cardId)).name)
        }
    }

    useEffect(() => {
        getCardName();
    }, [cardId, variation])

    const navigate = useNavigate();

    const link = new Link('https://link.x.immutable.com');

    const getTokensPrice = async () => {
        const result = await props.priceRepo.getTokensPrice([Tokens.ETH, Tokens.GODS, Tokens.IMX]);
        setEthPrice(result.ethereum.usd);
        setGodsPrice(result["gods-unchained"].usd)
        setImxPrice(result['immutable-x'].usd)
    }

    useEffect(() => {
        getTokensPrice();
        
    }, [])

    // register and/or setup a user
    async function linkSetup(): Promise<void> {
        const res = await link.setup({})
        setWallet(res.address)
        localStorage.setItem('address', res.address);
    };
    
    const renderBreadcrumb = () => {
        if (cardId) {
            return (
                <div>
                    <span className="breadcrumb-separator">|</span>
                    <span>{cardName}</span>
                </div>
            )
        }
    }

    return(
        <div className="container">
            <div className="nav">
                <div className="breadcrumb-container">
                    <span className="breadcrumb-item" onClick={() => navigate('/')}>Trader</span>
                    {renderBreadcrumb()}
                </div>
                <div className="wallet-container">
                    {
                        !wallet && 
                        <div onClick={() => linkSetup()} className="imx-wallet-container">
                            Connect Wallet
                        </div>
                    }
                    {
                        !!wallet && <div className="imx-wallet-container">Connected</div>
                    }
                    <div className="token-container">
                        <div className="value-container">
                            <span className="text-container">{godsPrice}</span>
                            <img width={16} src={godsSrc} />
                        </div>
                        <div className="value-container">
                            <span className="text-container">{ethPrice}</span>
                            <img width={16} src={ethSrc} />
                        </div>
                    </div>
                </div>
            </div>
            <Outlet context={{wallet: wallet, ethPrice: ethPrice, godsPrice: godsPrice, imxPrice: imxPrice}} />
        </div>
        
    )
}

export function useWallet() {
    return useOutletContext<ContextType>();
}