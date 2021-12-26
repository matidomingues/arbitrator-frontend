export interface IImmutableApi {
    fetchOrders(cardName: string, token: Tokens): Promise<OrderResponse>;
}

export interface OrderResponse {
        cursor: string,
        remaining: number,
        result: CardResponse[],
}

export interface CardResponse {
    amount_sold: string,
    buy: {
        data: {
            decimals: number,
            id: string,
            properties: {
                collection: {
                    icon_url: string,
                    name: string
                },
                image_url: string,
                name: string
            },
            quantity: number,
            token_address: string,
            token_id: string
        },
        type: string
    },
    expiration_timestamp: string,
    fees: [
        {
            address: string,
            amount: string,
            token: {
                data: {
                    contract_address: string,
                    decimals: 0
                },
                type: string
            },
            type: string
        }
    ],
    order_id: number,
    sell: {
        data: {
            decimals: number,
            id: string,
            properties: {
                collection: {
                    icon_url: string,
                    name: string
                },
                image_url: string,
                name: string
            },
            quantity: number,
            token_address: string,
            token_id: string
        },
        type: string
    },
    status: string,
    timestamp: string,
    updated_timestamp: string,
    user: string
      
}

export enum Tokens {
    ETH,
    GODS,
    IMX,
    USDC,
    GOG
}