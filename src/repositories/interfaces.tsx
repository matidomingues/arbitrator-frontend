import { Tokens } from "../api/interfaces";

export interface Order {
    orderId: number,
    ammount: number,
    currency: Tokens,
    owner: string
}

export interface Card {
    id: string,
    variation: string,
    name: string
}

export interface IInventoryCard extends Card {
    tokenId: string;
    orders: Order;
    ownerAddress: string;
}