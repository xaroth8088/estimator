import React from 'react';
import PropTypes from 'prop-types';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { useDispatch } from 'react-redux';
import ClearBoard from '~/components/ClearBoard/ClearBoard';
import Column from '~/components/Column/Column';
import CreateCard from '~/components/CreateCard/CreateCard';
import { addCard, clearBoard } from '~/actions';

import '~/components/Estimator/Estimator.css';

function Estimator({ columns, cards }) {
    const dispatch = useDispatch();

    const columnsComponents = Object.keys(columns).map(
        (columnId) => (
            <Column
                key={columnId}
                columnId={columnId}
                cardIds={columns[columnId]}
                cards={cards}
            />
        ),
    );

    return (
        <DndProvider backend={HTML5Backend}>
            <div className="estimator">
                <div className="toolbar">
                    <CreateCard onCreateCard={(title) => dispatch(addCard(title))} />
                    <ClearBoard onClearBoard={() => dispatch(clearBoard())} />
                </div>

                <div className="estimator-columns">
                    {columnsComponents}
                </div>
            </div>
        </DndProvider>
    );
}

Estimator.propTypes = {
    columns: PropTypes.shape({}).isRequired,
    cards: PropTypes.shape({}).isRequired,
};

export default Estimator;
