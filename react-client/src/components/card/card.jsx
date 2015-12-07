import React from "react"

import { DragSource } from 'react-dnd';
import { ItemTypes } from '../../constants.es6';

import "./card.css"

const cardSource = {
    beginDrag(props) {
        return {
            card: props.card
        };
    }
};

function collect(connect, monitor) {
    return {
        connectDragSource: connect.dragSource(),
        isDragging: monitor.isDragging()
    };
}

var Card = React.createClass({
    render() {
        const { isDragging, connectDragSource, card } = this.props;

        return connectDragSource(
            <div className="card" style={{ opacity: isDragging ? 0.5 : 1 }}>
                <div className="card-title">
                    {card.title}
                    </div>
                <div className="card-move-count">
                    {card.history.length}
                </div>
                <div className="card-history">
                    {card.history.join(',')}
                </div>
            </div>
        );
    }
});

export default DragSource(ItemTypes.CARD, cardSource, collect)(Card);
