export interface IImmutableApi {
    fetchOrders(cardId: number, token: Tokens): Promise<OrderResponse>;
    fetchInventory(wallet: string, cardId?: number): Promise<IInventoryResponse>;
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

export interface ICoinPrice {
    ethereum: {
        usd: number;
    },
    ['gods-unchained']:{
        usd: number,
    }
}

export interface IInventoryResponse {
    cursor: string,
    remaining: number,
    result: [
        {
        collection: {
            icon_url: string,
            name: string
        },
        created_at: string,
        description: string,
        fees: [
            {
            address: string,
            percentage: number,
            type: string
            }
        ],
        id: string,
        image_url: string,
        metadata: [ {
            god: string,
                set: string,
                mana: 3,
                name: string,
                type: string,
                image: string,
                proto: number,
                attack: number,
                effect: string,
                health: number,
                rarity: string,
                quality: string
        }],
        name: string,
        orders: {
            sell_orders: [
            {
                order_id: number,
                user: string,
                status: string,
                contract_address: string,
                buy_quantity: number,
                buy_decimals: number
            }
            ]
        },
        status: string,
        token_address: string,
        token_id: string,
        updated_at: string,
        uri: string,
        user: string
        }
    ]
    }
