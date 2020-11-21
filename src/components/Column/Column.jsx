import PropTypes from 'prop-types';
import React from 'react';

import { useDrop } from 'react-dnd';
import { useDispatch } from 'react-redux';
import { moveCard } from '~/actions';
import Card from '~/components/Card/Card';

import '~/components/Column/Column.css';
import { ItemTypes } from '~/constants';

function Column({ columnId, cardIds, cards }) {
    const dispatch = useDispatch();
    const [{ isOver }, drop] = useDrop({
        accept: ItemTypes.CARD,
        drop({ card }) {
            dispatch(moveCard(card.cardId, columnId));
        },
        collect: (monitor) => ({
            isOver: !!monitor.isOver(),
        }),
    });
    let columnClass;

    const cardComponents = cardIds.map(
        (cardId) => (
            <div key={cardId} className="column-card">
                <Card card={cards[cardId]} />
            </div>
        ),
    );

    columnClass = 'column';
    if (isOver === true) {
        columnClass += ' hover';
    }

    return (
        <div className={columnClass} ref={drop}>
            <div className="column-header">
                {columnId}
            </div>
            <div className="column-body">
                {cardComponents}
            </div>
        </div>
    );
}

Column.propTypes = {
    columnId: PropTypes.string.isRequired,
    cardIds: PropTypes.arrayOf(PropTypes.string).isRequired,
    cards: PropTypes.shape({}).isRequired,
};

export default Column;
