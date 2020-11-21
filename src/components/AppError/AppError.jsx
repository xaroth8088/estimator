import React from 'react';

import '~/components/AppError/AppError.css';

function AppError() {
    return (
        <div className="app_error">
            Estimator has disconnected from the server. Please refresh and try again.
        </div>
    );
}

export default AppError;
