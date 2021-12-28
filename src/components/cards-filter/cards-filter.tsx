import { Callout, DirectionalHint, SearchBox, TextField, Text } from "@fluentui/react";
import { useRef, useState } from "react"
import { cardData} from '../../configs/cards';
import './cards-filter.css';

export interface IProps {
    selectCard: (cardId: number, variation: number, cardName: string) => void;
    unselectCard: (cardId: number) => void;
    selectedCards: {cardId: number, cardName: string}[];
}

export function CardsFilter(props: IProps) {

    const [cardFilter, setCardFilter] = useState('');
    const boxRef = useRef(null);
    const selectCard = (cardId: number, cardName: string) => {
        props.selectCard(cardId, 4, cardName);
        setCardFilter('');
    } 

    return (
        <div className='Sidebar'>
          <div>
            <TextField placeholder="Search Card" value={cardFilter} onChange={(_, value) => setCardFilter(value || '')} elementRef={boxRef} />
            {!!cardFilter && 
                <Callout isBeakVisible={false} target={boxRef} directionalHint={DirectionalHint.bottomLeftEdge} onDismiss={() => setCardFilter('')}>
                    <div className="cardsFilter">
                        {cardData.records.filter(card => 
                            card.collectable && (
                                card.name.toLocaleLowerCase().includes(cardFilter.toLocaleLowerCase()) ||
                                card.id.toString().includes(cardFilter)
                            ) 
                        ).map((card => 
                         <p onClick={() => selectCard(card.id, card.name)} className="text" key={card.id}>
                         {card.name}
                       </p>))}
                    </div>
                </Callout> 
            }
            
          </div>
            {props.selectedCards.map(trackedCard => 
                <div className="selected-token" onClick={() => props.unselectCard(trackedCard.cardId)}>
                    {trackedCard.cardName}
                    <span className="remove-token">x</span>
                </div>
            )}
      </div>
    )
}