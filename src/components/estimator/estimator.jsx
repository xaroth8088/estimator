import React from 'react';

import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { useDispatch } from 'react-redux';
import { addCard, clearBoard } from '../../actions.es6';
import ClearBoard from '../clear_board/clear_board.jsx';
import Column from '../column/column.jsx';
import CreateCard from '../create_card/create_card.jsx';

import './estimator.css';

function Estimator({columns, cards}) {
    const dispatch = useDispatch();
    var columnsComponents, column_id;

    columnsComponents = [];
    for (column_id of Object.keys(columns)) {
        columnsComponents.push(
            <Column
                key={column_id}
                column_id={column_id}
                card_ids={columns[column_id]}
                cards={cards}
            />
        );
    }

    return (
        <DndProvider backend={HTML5Backend}>
            <div className="estimator">
                <div className="toolbar">
                    <CreateCard onCreateCard={title => dispatch(addCard(title))} />
                    <ClearBoard onClearBoard={() => dispatch(clearBoard())} />
                </div>

                <div className="estimator-columns">
                    {columnsComponents}
                </div>
            </div>
        </DndProvider>
    );
}

export default Estimator;
