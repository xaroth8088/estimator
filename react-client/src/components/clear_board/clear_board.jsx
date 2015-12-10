import React from 'react'
import store from '../../redux_store.es6'
import { clearBoard } from '../../actions.es6'

import './clear_board.css'

export default React.createClass({
    getInitialState() {
        return {
            confirming: false
        }
    },

    render() {
        var class_name;

        class_name = "clear_board";

        if( this.state.confirming === true ) {
            class_name += " clear_board-confirming";

            return (
                <div className={class_name}>
                    <div className="clear_board-confirm-title">
                        Confirm deleting all cards?
                    </div>
                    <button onClick={this.onConfirmClearBoardClicked} className="clear_board-confirm-button">Nuke 'em!</button>
                    <button onClick={this.onCancelClearBoardClicked} className="clear_board-cancel-button">Nevermind</button>
                </div>
            )
        } else {
            return (
                <div className={class_name}>
                    <button onClick={this.onClearBoardClicked} className="clear_board-button">Clear Board</button>
                </div>
            )
        }
    },

    onClearBoardClicked() {
        this.setState({
            confirming: true
        });
    },

    onConfirmClearBoardClicked() {
        this.setState({
            confirming: false
        });

        this.props.onClearBoard();
    },

    onCancelClearBoardClicked() {
        this.setState({
            confirming: false
        });
    }
});
