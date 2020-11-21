import React, { useState } from 'react';
import { useDrag } from 'react-dnd';
import PropTypes from 'prop-types';
import { deleteCard } from '~/actions';
import { ItemTypes } from '~/constants';
import store from '~/redux_store';

import '~/components/Card/Card.css';

function Card({ card }) {
    const [showHistory, setShowHistory] = useState(false);
    const [confirmingDelete, setConfirmingDelete] = useState(false);

    const [{ isDragging }, drag] = useDrag({
        item: {
            card,
            type: ItemTypes.CARD,
        },
        collect: (monitor) => ({
            isDragging: !!monitor.isDragging(),
        }),
    });

    let cardClass;
    let historyClass;

    cardClass = 'card';
    if (isDragging === true) {
        cardClass += ' dragging';
    }

    if (card.history.length > 5) {
        cardClass += ' warning';
    }

    historyClass = 'card-history';
    if (showHistory === false) {
        historyClass += ' hidden';
    }

    if (confirmingDelete === true) {
        cardClass += ' confirm_delete';
        return (
            <div className={cardClass}>
                <div className="card-confirm-title">
                    Confirm Delete?
                </div>
                <button
                    type="button"
                    onClick={() => {
                        store.dispatch(deleteCard(card.cardId));
                    }}
                    className="card-confirm-button"
                >
                    Delete!
                </button>
                <button
                    type="button"
                    onClick={() => setConfirmingDelete(false)}
                    className="card-cancel-button"
                >
                    Nevermind
                </button>
            </div>
        );
    }
    return (
        <div className={cardClass} ref={drag}>
            <div className="card-title">
                {card.title}
            </div>
            <button
                type="button"
                className="card-move-count"
                onClick={() => setShowHistory(!showHistory)}
            >
                {card.history.length}
            </button>
            <button
                type="button"
                className="card-delete-button"
                onClick={() => setConfirmingDelete(true)}
            >
                Delete
            </button>
            <div className={historyClass}>
                {card.history.join(', ')}
            </div>
        </div>
    );
}

Card.propTypes = {
    card: PropTypes.shape({
        cardId: PropTypes.string.isRequired,
        history: PropTypes.arrayOf(
            PropTypes.string,
        ).isRequired,
        title: PropTypes.string.isRequired,
    }).isRequired,
};

export default Card;
