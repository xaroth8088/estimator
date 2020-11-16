import React from 'react';

import { useDrop } from 'react-dnd';
import { useDispatch } from 'react-redux';
import { moveCard } from '../../actions.es6';
import { ItemTypes } from '../../constants.es6';
import Card from '../card/card.jsx';

import './column.css';

function Column({ column_id, card_ids, cards }) {
    const dispatch = useDispatch();
    const [{ isOver }, drop] = useDrop({
        accept: ItemTypes.CARD,
        drop({ card }) {
            dispatch(moveCard(card.card_id, column_id));
        },
        collect: (monitor) => ({
            isOver: !!monitor.isOver()
        })
    });
    var card_id, cardComponents, column_class;

    cardComponents = [];
    for (card_id of card_ids) {
        cardComponents.push(
            <div key={card_id} className="column-card">
                <Card card={cards[card_id]} />
            </div>
        );
    }

    column_class = 'column';
    if (isOver === true) {
        column_class += ' hover';
    }

    return (
        <div className={column_class} ref={drop}>
            <div className="column-header">
                {column_id}
            </div>
            <div className="column-body">
                {cardComponents}
            </div>
        </div>
    );
}

export default Column;
