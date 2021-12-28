import { Outlet, useNavigate, useOutletContext } from "react-router-dom";
import './app.css';

import godsSrc from '../../assets/gods.png';
import ethSrc from '../../assets/eth.png'
import { PriceRepo } from "../../repositories/price-repo";
import { useEffect, useState } from "react";
import { Tokens } from "../../api/interfaces";
import { Link } from "@imtbl/imx-sdk";

interface IProps {
    priceRepo: PriceRepo;
}

type ContextType = { wallet: string | null };

export function App(props: IProps) {

    const [ethPrice, setEthPrice] = useState(0);
    const [godsPrice, setGodsPrice] = useState(0);
    const [wallet, setWallet] = useState(localStorage.getItem('address'));

    const navigate = useNavigate();

    const link = new Link('https://link.x.immutable.com');

    const getTokensPrice = async () => {
        const result = await props.priceRepo.getTokensPrice([Tokens.ETH, Tokens.GODS]);
        setEthPrice(result.ethereum.usd);
        setGodsPrice(result["gods-unchained"].usd)
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
    

    return(
        <div className="container">
            <div className="nav">
                <span className="breadcrumb-item" onClick={() => navigate('/')}>Trader</span>
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
            <Outlet context={[wallet]} />
        </div>
        
    )
}

export function useWallet() {
    return useOutletContext<ContextType>();
}