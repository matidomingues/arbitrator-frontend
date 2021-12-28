import { IImmutableApi, IInventoryResponse, OrderResponse, Tokens } from "./interfaces";

export class ImmutableApi implements IImmutableApi {

    fetchOrders(cardId: number, token: Tokens): Promise<OrderResponse> {
        return fetch(this.prepareUrl(cardId, token)).then(response => response.json());
    }

    fetchInventory(wallet: string, cardId?: number): Promise<IInventoryResponse> {
        return fetch(this.prepareInventoryUrl(wallet, cardId)).then(response => response.json());
    }

    private prepareInventoryUrl(wallet: string, cardId?: number) {
        const url = new URL('https://api.x.immutable.com/v1/assets');
        url.searchParams.append('user', wallet);
        url.searchParams.append('sell_orders', 'true');
        if (cardId) {
            url.searchParams.append('metadata', JSON.stringify({proto:[cardId.toString()]}));
        }

        return url.toString();
    }

    private prepareUrl(cardId: number, token: Tokens) {
        const url = new URL('https://api.x.immutable.com/v1/orders');
        url.searchParams.append('direction', 'asc');
        url.searchParams.append('include_fees', 'true');
        url.searchParams.append('order_by', 'buy_quantity');
        url.searchParams.append('page_size', '48');
        url.searchParams.append('sell_metadata', JSON.stringify({proto:[cardId.toString()]}));
        url.searchParams.append('sell_token_type', 'ERC721');
        url.searchParams.append('status', 'active');
        url.searchParams.append('sell_token_address', '0xacb3c6a43d15b907e8433077b6d38ae40936fe2c')

        switch(token) {
            case Tokens.ETH: url.searchParams.append('buy_token_type', 'ETH'); break;
            case Tokens.GODS: url.searchParams.append('buy_token_address', '0xccc8cb5229b0ac8069c51fd58367fd1e622afd97'); break;
        }

        return url.toString();


    }
}