import React, { useState } from 'react';

import './clear_board.css';

function ClearBoard({ onClearBoard }) {
    const [confirming, setConfirming] = useState(false);
    var class_name;

    class_name = 'clear_board';

    if (confirming === true) {
        class_name += ' clear_board-confirming';

        return (
            <div className={class_name}>
                <div className="clear_board-confirm-title">
                    Confirm deleting all cards?
                </div>
                <button onClick={() => {
                    setConfirming(false);
                    onClearBoard();
                }} className="clear_board-confirm-button">Nuke 'em!
                </button>
                <button onClick={() => setConfirming(false)} className="clear_board-cancel-button">Nevermind</button>
            </div>
        );
    } else {
        return (
            <div className={class_name}>
                <button onClick={() => setConfirming(true)} className="clear_board-button">Clear Board</button>
            </div>
        );
    }
}

export default ClearBoard;
