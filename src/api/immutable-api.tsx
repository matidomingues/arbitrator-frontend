import { TokenToAddress } from "../components/inventory/inventory-card";
import { IImmutableApi, IInventoryResponse, OrderResponse, Tokens } from "./interfaces";

export class ImmutableApi implements IImmutableApi {

    fetchOrders(cardId: number, variation: number, token: Tokens): Promise<OrderResponse> {
        return fetch(this.prepareUrl(cardId, variation, token)).then(response => response.json());
    }

    fetchInventory(wallet: string, cardId?: number, variation?: number): Promise<IInventoryResponse> {
        return fetch(this.prepareInventoryUrl(wallet, cardId, variation)).then(response => response.json());
    }

    private prepareInventoryUrl(wallet: string, cardId?: number, variation?: number) {
        const url = new URL('https://api.x.immutable.com/v1/assets');
        url.searchParams.append('user', wallet);
        url.searchParams.append('sell_orders', 'true');
        if (cardId && variation) {
            url.searchParams.append('metadata', JSON.stringify({proto:[cardId.toString()], quality:[this.getQuality(variation)]}));
        }

        return url.toString();
    }

    getQuality(variation:number) {
        switch(variation) {
            case 4: return 'Meteorite';
            case 3: return 'Shadow';
            case 2: return 'Gold';
            case 1: return 'Diamond';
        }
        return 'Meteorite';
    }

    private prepareUrl(cardId: number, variation: number, token: Tokens) {
        const url = new URL('https://api.x.immutable.com/v1/orders');
        url.searchParams.append('direction', 'asc');
        url.searchParams.append('include_fees', 'true');
        url.searchParams.append('order_by', 'buy_quantity');
        url.searchParams.append('page_size', '48');
        url.searchParams.append('sell_metadata', JSON.stringify({proto:[cardId.toString()], quality:[this.getQuality(variation)]}));
        url.searchParams.append('sell_token_type', 'ERC721');
        url.searchParams.append('status', 'active');
        url.searchParams.append('sell_token_address', '0xacb3c6a43d15b907e8433077b6d38ae40936fe2c')

        switch(token) {
            case Tokens.ETH: url.searchParams.append('buy_token_type', 'ETH'); break;
            case Tokens.GODS: url.searchParams.append('buy_token_address', TokenToAddress.GODS); break;
            case Tokens.IMX: url.searchParams.append('buy_token_address', TokenToAddress.IMX); break;
            case Tokens.USDC: url.searchParams.append('buy_token_address', TokenToAddress.USDC); break;
            case Tokens.GOG: url.searchParams.append('buy_token_address', TokenToAddress.GOG); break;

        }

        return url.toString();


    }
}