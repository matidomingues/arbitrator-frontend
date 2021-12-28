import { ImmutableApi } from "../api/immutable-api";
import { CardResponse, IImmutableApi, IInventoryResponse, Tokens } from "../api/interfaces";
import { TaskQueue } from "../components/task-queue/task-queue";
import { cardData } from "../configs/cards";
import { Card, IInventoryCard, Order } from "./interfaces";

export class ImmutableRepo {

    private ordersByCard: {[cardId: string]: Order[]} = {}
    private cardById: {[cardId: string]: Card} = {};

    constructor(private immutableApi: IImmutableApi, private immutableTaskQueue: TaskQueue) {
    }

    fetchOrders(cardId: number, variation: number, token: Tokens, force?: boolean): Promise<Order[]> {
        const cardKey = `${cardId}-${variation}-${token}`;

        if(!force && this.ordersByCard[cardKey]) {
            return Promise.resolve(this.ordersByCard[cardKey])
        }

        return this.immutableTaskQueue.addTask(() => this.immutableApi.fetchOrders(cardId, token).then(response => {
            // if we are getting fresh, clear the cache
            console.log(response);
            this.ordersByCard[cardKey] = [];
            this.populateCards(response.result, token);
            console.log(this.ordersByCard[cardKey])
            return this.ordersByCard[cardKey];
        
        }));
    }

    fetchCard(cardId: number, variation: number): Card {
        const cardKey = `${cardId}-${variation}`;

        return this.cardById[cardKey];
    }

    fetchInventory(wallet: string, cardId?: number) {
        return this.immutableTaskQueue.addTask(() => this.immutableApi.fetchInventory(wallet, cardId).then(response => this.marshalInventory(response)));
    }


    marshalInventory(inventory: IInventoryResponse): IInventoryCard[] {
        return inventory.result.map(card => {
            const cardUrl = new URL(card.image_url);
    
            const cardId = cardUrl.searchParams.get('id') || '';
            const cardVariation = cardUrl.searchParams.get('q') || '';

            return {
                id: cardId,
                ownerAddress: card.token_address,
                variation: cardVariation,
                name: card.name,
                tokenId: card.token_id,
                orders: card.orders?.sell_orders?.length > 0 ? this.populateOrderFromInventory(card.orders.sell_orders[0]) : null,
            } as IInventoryCard;
        });
    }

    populateOrderFromInventory(order: any): Order {
        return {
            orderId: order.order_id,
            ammount: order.buy_quantity/(Math.pow(10,order.buy_decimals)),
            currency: order.contract_address == "contract_address" ? Tokens.GODS : Tokens.ETH
        }
    }

    populateCards(cards: CardResponse[], token: Tokens) {
        cards.forEach(card => {
            const cardUrl = new URL(card.sell.data.properties.image_url);
    
            const cardId = cardUrl.searchParams.get('id') || '';
            const cardVariation = cardUrl.searchParams.get('q') || '';
    
            const cardKey = `${cardId}-${cardVariation}`;
        
            if (!this.cardById[cardKey]) {
                this.cardById[cardKey] = {name: card.sell.data.properties.name, id: cardId, variation: cardVariation}
            }
            const cardKeyToken = `${cardId}-${cardVariation}-${token}`;

            const price = card.buy.data.quantity/(Math.pow(10,card.buy.data.decimals))
            if (!this.ordersByCard[cardKeyToken]) {
                this.ordersByCard[cardKeyToken] = [];
            }

            this.ordersByCard[cardKeyToken].push({ammount: price, currency: token, orderId: card.order_id});
        })
    }
}