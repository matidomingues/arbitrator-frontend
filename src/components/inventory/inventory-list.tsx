import { Link } from "@imtbl/imx-sdk";
import { IInventoryCard } from "../../repositories/interfaces";
import { InventoryCard } from "./inventory-card";

interface IProps {
    inventory: IInventoryCard[],
    link: Link
}

export function InventoryList(props: IProps) {
    return (
        <div>
            Inventory
            <div>
                {props.inventory.map(card => <InventoryCard card={card} link={props.link} />)}
            </div>
        </div>
    )
}