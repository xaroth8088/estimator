import PropTypes from 'prop-types';
import React, { useState } from 'react';
import '~/components/CreateCard/CreateCard.css';

function CreateCard({ onCreateCard }) {
    const [cardTitle, setCardTitle] = useState('');
    return (
        <div className="create_card">
            <textarea
                placeholder="Enter card text, one per line"
                value={cardTitle}
                onChange={(e) => setCardTitle(e.target.value)}
            />
            <button
                type="button"
                onClick={() => {
                    if (cardTitle === '') {
                        return;
                    }

                    // Split on newlines, to permit a bulk entry
                    const cards = cardTitle.split('\n');

                    cards.forEach(
                        (card) => {
                            if (card.trim() !== '') {
                                onCreateCard(card);
                            }
                        },
                    );

                    // Clear out the input box
                    setCardTitle('');
                }}
            >
                Make it!
            </button>
        </div>
    );
}

CreateCard.propTypes = {
    onCreateCard: PropTypes.func.isRequired,
};

export default CreateCard;
