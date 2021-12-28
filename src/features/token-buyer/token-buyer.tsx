import { ImmutableMethodResults, ImmutableXClient, Link, LinkResultsCodecs } from "@imtbl/imx-sdk";
import { throws } from "assert";
import { useEffect, useState } from "react";
import { useOutletContext, useParams } from "react-router-dom";
import { ImmutableApi } from "../../api/immutable-api";
import { Tokens } from "../../api/interfaces";
import { InventoryList } from "../../components/inventory/inventory-list";
import { TaskQueue } from "../../components/task-queue/task-queue";
import { cardData } from "../../configs/cards";
import { ImmutableRepo } from "../../repositories/immutable-repo";
import { IInventoryCard, Order } from "../../repositories/interfaces";
import { useWallet } from "../app/app";
import './token-buyer.css';

export interface IProps {
    immutableRepo: ImmutableRepo;
}

export function TokenBuyer(props: IProps) {
    let params = useParams();
    const link = new Link('https://link.x.immutable.com');

    const wallet = useWallet(); 

    const [ethOrders, setEthOrders] = useState([] as Order[]);
    const [godsOrders, setGodsOrders] = useState([] as Order[]);
    const [inventory, setInventory] = useState([] as IInventoryCard[]);
    const [toBuyEth, setToBuyEth] = useState(0);
    const [toBuyGods, setToBuyGods] = useState(0);

    
    const cardId = parseInt(params.cardId || '0');
    const variation = parseInt(params.variationId || '0');
    
    const fetchEthPrice = async () => {
        const orders =  await props.immutableRepo.fetchOrders(cardId, variation, Tokens.ETH);
        setEthOrders(orders);
    }

    const fetchGordOrders = async () => {
        const orders =  await props.immutableRepo.fetchOrders(cardId, variation, Tokens.GODS);
        setGodsOrders(orders);
    }

    const fetchInventory = async () => {
        if(wallet.wallet) {
            const inventory = await props.immutableRepo.fetchInventory(wallet.wallet, cardId);
            console.log(inventory);
            setInventory(inventory);
        } else {
            console.log('nowallet');
        }
    }

    useEffect(() => {
        fetchEthPrice();
        fetchGordOrders();
        fetchInventory();
    }, [params.cardId, params.variation]);

    async function buyTokens(currency: Tokens, amount: number) {
        const orderSource = currency == Tokens.ETH ? ethOrders : godsOrders;
        link.buy({orderIds: orderSource.slice(0, amount).map(order => order.orderId.toString())});
    }

    return(
        <div>
            <div className="space-container">
                <div className="token-container">
                    <span>ETH</span>
                    <div className="order-container">
                        {ethOrders.map(order => <span>{order.ammount}</span>)}
                    </div>
                    <div>
                        <input type="number" value={toBuyEth} onChange={(e) => setToBuyEth(parseInt(e.target.value))} />
                        <button onClick={() => buyTokens(Tokens.ETH, toBuyEth)}>buy</button>
                    </div>                </div>
                <div className="token-container">
                    <span>GODS</span>
                    <div className="order-container">
                        {godsOrders.map(order => <span>{order.ammount}</span>)}
                    </div>
                    <div>
                        <input type="number" value={toBuyGods} onChange={(e) => setToBuyGods(parseInt(e.target.value))} />
                        <button onClick={() => buyTokens(Tokens.GODS, toBuyGods)}>buy</button>
                    </div>
                </div>
            </div>
            <InventoryList inventory={inventory} link={link}/>
        </div>
    )
}