import { Link } from "@imtbl/imx-sdk";
import { IInventoryCard } from "../../repositories/interfaces";
import { InventoryCard } from "./inventory-card";

import './inventory.css'

interface IProps {
    inventory: IInventoryCard[],
    link: Link
}

export function InventoryList(props: IProps) {
    if (!props.inventory || props.inventory.length === 0) {
        return (
            <span className="inventory-container">
                You have no cards of this type
            </span>
        )
    }
    return (
        <div className="inventory-container">
            {props.inventory.map(card => <InventoryCard card={card} link={props.link} />)}
        </div>
    )
}