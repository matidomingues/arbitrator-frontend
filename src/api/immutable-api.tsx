import { IImmutableApi, OrderResponse, Tokens } from "./interfaces";

export class ImmutableApi implements IImmutableApi {

    fetchOrders(cardName: string, token: Tokens): Promise<OrderResponse> {
        return fetch(this.prepareUrl(cardName, token)).then(response => response.json());
    }

    private prepareUrl(cardName: string, token: Tokens) {
        const url = new URL('https://api.x.immutable.com/v1/orders');
        url.searchParams.append('direction', 'asc');
        url.searchParams.append('include_fees', 'true');
        url.searchParams.append('order_by', 'buy_quantity');
        url.searchParams.append('page_size', '48');
        url.searchParams.append('sell_token_name', cardName);
        url.searchParams.append('sell_token_type', 'ERC721');
        url.searchParams.append('status', 'active');

        switch(token) {
            case Tokens.ETH: url.searchParams.append('buy_token_type', 'ETH'); break;
            case Tokens.GODS: url.searchParams.append('buy_token_address', '0xccc8cb5229b0ac8069c51fd58367fd1e622afd97'); break;
        }

        return url.toString();


    }
}