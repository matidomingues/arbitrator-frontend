import { Link } from "@imtbl/imx-sdk";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Tokens } from "../../api/interfaces";
import { InventoryList } from "../../components/inventory/inventory-list";
import { ImmutableRepo } from "../../repositories/immutable-repo";
import { IInventoryCard, Order } from "../../repositories/interfaces";
import { useWallet } from "../app/app";
import './token-buyer.css';
import godsSrc from '../../assets/gods.png';
import ethSrc from '../../assets/eth.png'
import usdcSrc from '../../assets/usdc.png';
import imxSrc from '../../assets/imx.png'
import { PrimaryButton } from "@fluentui/react";

export interface IProps {
    immutableRepo: ImmutableRepo;
}

export function TokenBuyer(props: IProps) {
    let params = useParams();
    const cardId = parseInt(params.cardId || '0');
    const variation = parseInt(params.variationId || '0');

    const link = new Link('https://link.x.immutable.com');

    const wallet = useWallet(); 

    const [ethOrders, setEthOrders] = useState([] as Order[]);
    const [godsOrders, setGodsOrders] = useState([] as Order[]);
    const [usdcOrders, setUsdcOrders] = useState([] as Order[]);
    const [imxOrders, setImxOrders] = useState([] as Order[]);
    const [inventory, setInventory] = useState([] as IInventoryCard[]);
    const [toBuyEth, setToBuyEth] = useState(1);
    const [toBuyGods, setToBuyGods] = useState(1);
    const [toBuyImx, setToBuyImx] = useState(1);
    const [toBuyUsdc, setToBuyUsdc] = useState(1);
    
    const fetchEthPrice = async () => {
        const orders =  await props.immutableRepo.fetchOrders(cardId, variation, Tokens.ETH);
        setEthOrders(orders);
    }

    const fetchGordOrders = async () => {
        const orders =  await props.immutableRepo.fetchOrders(cardId, variation, Tokens.GODS);
        setGodsOrders(orders);
    }

    const fetchImxOrders = async () => {
        const orders =  await props.immutableRepo.fetchOrders(cardId, variation, Tokens.IMX);
        setImxOrders(orders);
    }

    const fetchUsdcOrders = async () => {
        const orders =  await props.immutableRepo.fetchOrders(cardId, variation, Tokens.USDC);
        setUsdcOrders(orders);
    }

    const fetchInventory = async () => {
        if(wallet?.wallet) {
            const inventory = await props.immutableRepo.fetchInventory(wallet.wallet, cardId, variation);
            console.log(inventory);
            setInventory(inventory);
        } else {
            console.log('nowallet');
        }
    }

    useEffect(() => {
        fetchEthPrice();
        fetchGordOrders();
        fetchImxOrders();
        fetchUsdcOrders();
        fetchInventory();
    }, [params.cardId, params.variation]);

    const getOrderSource = (token: Tokens) => {
        switch(token) {
            case Tokens.ETH: return ethOrders;
            case Tokens.GODS: return godsOrders;
            case Tokens.IMX: return imxOrders;
            case Tokens.USDC: return usdcOrders;
            default: return null;
        }
    }

    async function buyTokens(currency: Tokens, amount: number) {
        const orderSource = getOrderSource(currency);
        if (orderSource) {
            link.buy({orderIds: orderSource.slice(0, amount).map(order => order.orderId.toString())}).then(response => {
                console.log('returned');
            });
        }
    }

    return(
        <div>
            <div className="section-title">
                Active buy Orders
            </div>
            <div className="space-container">
                <div>
                    <div className="orders-container">
                        <div className="image-container"><img width={32} src={ethSrc}/></div>
                        <div className="order-container">
                            {ethOrders.map(order => <span>{order.ammount} ({(order.ammount * (wallet.ethPrice || 0)).toFixed(2)}$)</span>)}
                        </div>               
                    </div>
                    <div className="buy-container">
                        <div className="buy-amount-container">
                            <span>Amount: </span>
                            <input placeholder="Amount to buy" type="number" value={toBuyEth} onChange={(e) => setToBuyEth(parseInt(e.target.value))} />
                        </div>
                            <PrimaryButton onClick={() => buyTokens(Tokens.ETH, toBuyEth)}>Buy in Eth</PrimaryButton>
                    </div> 
                </div>
                <div>
                    <div className="orders-container">
                        <div className="image-container"><img width={32} src={godsSrc}/></div>
                        <div className="order-container">
                            {godsOrders.map(order => <span>{order.ammount} ({(order.ammount * (wallet.godsPrice || 0)).toFixed(2)}$)</span>)}
                        </div>
                    </div>
                    <div className="buy-container">
                        <div className="buy-amount-container">
                            <span>Amount: </span>
                            <input placeholder="Amount to buy" type="number" value={toBuyGods} onChange={(e) => setToBuyGods(parseInt(e.target.value))} />
                        </div>
                            <PrimaryButton onClick={() => buyTokens(Tokens.GODS, toBuyGods)}>Buy in Gods</PrimaryButton>
                    </div>
                </div>
                {/* <div>
                    <div className="orders-container">
                        <div className="image-container"><img width={32} src={imxSrc}/></div>
                        <div className="order-container">
                            {imxOrders.map(order => <span>{order.ammount}  ({(order.ammount * (wallet.imxPrice || 0)).toFixed(2)}$)</span>)}
                        </div>
                    </div>
                    <div className="buy-container">
                        <div className="buy-amount-container">
                            <span>Amount: </span>
                            <input placeholder="Amount to buy" type="number" value={toBuyImx} onChange={(e) => setToBuyImx(parseInt(e.target.value))} />
                        </div>
                            <PrimaryButton onClick={() => buyTokens(Tokens.IMX, toBuyImx)}>Buy in Imx</PrimaryButton>
                    </div>
                </div>
                <div>
                    <div className="orders-container">
                        <div className="image-container"><img width={32} src={usdcSrc}/></div>
                        <div className="order-container">
                            {usdcOrders.map(order => <span>{order.ammount}$</span>)}
                        </div>
                    </div>
                    <div className="buy-container">
                        <div className="buy-amount-container">
                            <span>Amount: </span>
                            <input placeholder="Amount to buy" type="number" value={toBuyUsdc} onChange={(e) => setToBuyUsdc(parseInt(e.target.value))} />
                        </div>
                            <PrimaryButton onClick={() => buyTokens(Tokens.USDC, toBuyUsdc)}>Buy in USDC</PrimaryButton>
                    </div>
                </div> */}
            </div> 
            <div className="section-title">
                Your Inventory
            </div>
            <InventoryList inventory={inventory} link={link}/>
        </div>
    )
}