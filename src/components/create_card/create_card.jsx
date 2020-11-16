import React, { useState } from 'react';
import './create_card.css';

function CreateCard({ onCreateCard }) {
    const [cardTitle, setCardTitle] = useState('');
    return (
        <div className="create_card">
            <textarea
                placeholder="Enter card text, one per line"
                value={cardTitle}
                onChange={(e) => setCardTitle(e.target.value)}
            />
            <button onClick={() => {
                var card_text, cards, card;

                if (cardTitle === '') {
                    return;
                }

                card_text = cardTitle;

                // Split on newlines, to permit a bulk entry
                cards = card_text.split('\n');

                for (card of cards) {
                    if (card.trim() !== '') {
                        onCreateCard(card);
                    }
                }

                // Clear out the input box
                setCardTitle('');
            }}>Make it!
            </button>
        </div>
    );
}

export default CreateCard;
