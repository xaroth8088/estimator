import React, { useState } from 'react';

import { useDrag } from 'react-dnd';
import { deleteCard } from '../../actions.es6';
import { ItemTypes } from '../../constants.es6';

import store from '../../redux_store.es6';

import './card.css';

function Card({ card }) {
    const [showHistory, setShowHistory] = useState(false);
    const [confirmingDelete, setConfirmingDelete] = useState(false);

    const [{ isDragging }, drag] = useDrag({
        item: {
            card,
            type: ItemTypes.CARD
        },
        collect: (monitor) => ({
            isDragging: !!monitor.isDragging()
        })
    });

    var card_class, history_class;

    card_class = 'card';
    if (isDragging === true) {
        card_class += ' dragging';
    }

    if (card.history.length > 5) {
        card_class += ' warning';
    }

    history_class = 'card-history';
    if (showHistory === false) {
        history_class += ' hidden';
    }

    if (confirmingDelete === true) {
        card_class += ' confirm_delete';
        return (
            <div className={card_class}>
                <div className="card-confirm-title">
                    Confirm Delete?
                </div>
                <button onClick={() => {
                    store.dispatch(deleteCard(card.card_id));
                }} className="card-confirm-button">Delete!
                </button>
                <button onClick={() => setConfirmingDelete(false)} className="card-cancel-button">Nevermind</button>
            </div>
        );
    } else {
        return (
            <div className={card_class} ref={drag}>
                <div className="card-title">
                    {card.title}
                </div>
                <div className="card-delete-button">
                    <button onClick={() => setConfirmingDelete(true)}>Delete</button>
                </div>
                <div className="card-move-count" onClick={() => setShowHistory(!showHistory)}>
                    {card.history.length}
                </div>
                <div className={history_class}>
                    {card.history.join(', ')}
                </div>
            </div>
        );
    }
}

export default Card;
