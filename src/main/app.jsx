import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import AppError from '../components/app_error/app_error.jsx';
import Estimator from '../components/estimator/estimator.jsx';
import Loading from '../components/loading/loading.jsx';
import { LOADING_STATES } from '../constants.es6';

function App() {
    const app_state = useSelector((state) => state.cards.app_state);
    const cards = useSelector((state) => state.cards.cards);
    const columns = useSelector((state) => state.cards.columns);
    const app_error_description = useSelector((state) => state.cards.app_error_description);
    const dispatch = useDispatch();

    if (app_state === LOADING_STATES.READY) {
        return (
            <Estimator cards={cards} columns={columns} dispatch={dispatch} />
        );
    } else if (app_state === LOADING_STATES.ERROR) {
        return (
            <AppError message={app_error_description} />
        );
    } else {
        return (
            <Loading app_state={app_state} />
        );
    }
}

export default App;
