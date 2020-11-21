import React, { useState } from 'react';
import PropTypes from 'prop-types';
import '~/components/ClearBoard/ClearBoard.css';

function ClearBoard({ onClearBoard }) {
    const [confirming, setConfirming] = useState(false);
    let className;

    className = 'clear_board';

    if (confirming === true) {
        className += ' clear_board-confirming';

        return (
            <div className={className}>
                <div className="clear_board-confirm-title">
                    Confirm deleting all cards?
                </div>
                <button
                    type="button"
                    onClick={() => {
                        setConfirming(false);
                        onClearBoard();
                    }}
                    className="clear_board-confirm-button"
                >
                    Nuke &apos;em!
                </button>
                <button
                    type="button"
                    onClick={() => setConfirming(false)}
                    className="clear_board-cancel-button"
                >
                    Nevermind
                </button>
            </div>
        );
    }
    return (
        <div className={className}>
            <button
                type="button"
                onClick={() => setConfirming(true)}
                className="clear_board-button"
            >
                Clear Board
            </button>
        </div>
    );
}

ClearBoard.propTypes = {
    onClearBoard: PropTypes.func.isRequired,
};

export default ClearBoard;
