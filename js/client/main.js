"use strict";
var CardState = new JS.Class({
    initialize: function () {
        this.session = null;
        this._initState();
        this.initial_timeout = null;
        this.subscription_set_initial_state = null;
        this.table_view = null;
        this.default_column = '?';
    },

    _initState: function() {
        this.state = {
            '1': {},
            '2': {},
            '3': {},
            '5': {},
            '8': {},
            '13': {},
            '21': {},
            '?': {},
            'inf': {}
        };
    },

    'start': function () {
        var connection;
        if (this.session !== null) {
            console.log("Unable to start - we already have a session!");
            return;
        }

        // Connect to the WAMP router
        connection = new autobahn.Connection({
            url: this._getWebsocketURI(),
            realm: this._getRealm()
        });

        connection.onopen = $.proxy(this._onConnectionOpened, this);
        connection.onclose = $.proxy(this._onConnectionClosed, this);

        // Actually connect
        console.log("Connecting to WAMP router...");
        connection.open();
    },

    _getRealm: function () {
        return "realm1";
    },

    _getWebsocketURI: function () {
        return "wss://demo.crossbar.io/ws";
    },

    _onSetInitialState: function (initial_state) {
        clearTimeout(this.initial_timeout);

        // Unsub from set_initial_state, since we won't need it any more
        this.session.unsubscribe(this.subscription_set_initial_state).then(
            $.proxy(this._onUnsubscribeSetInitialStateSuccess, this, initial_state),
            $.proxy(this._onUnsubscribeSetInitialStateFailed, this)
        );
    },

    _onUnsubscribeSetInitialStateSuccess: function(data) {
        var initial_state;

        initial_state = data[0];

        // At this point, it's safe to update our initial state and keep rolling forward
        console.log("Initial state received, ready to begin.");
        $('.spinner').remove();
        this.state = initial_state;

        // Sub to requests for initial state, for future clients
        this.session.subscribe("com.wikia.estimator.request_initial_state", $.proxy(this._onRequestInitialState, this));

        // Sub to new cards
        this.session.subscribe("com.wikia.estimator.new_card", $.proxy(this._onNewCard, this));

        // Sub to moves of existing cards
        this.session.subscribe("com.wikia.estimator.move_card", $.proxy(this._onMoveCard, this));

        // Draw our initial state
        this.table_view = new TableView(this);
        this.table_view.initial_draw();
    },

    _onUnsubscribeSetInitialStateFailed: function(error) {
        console.log("Unable to unsubscribe from set_initial_state:" + error);
    },

    _onRequestInitialState: function () {
        this.session.publish("com.wikia.estimator.set_initial_state", [this.state]);
    },

    _onNewCard: function (data) {
        var card;

        card = data[0];

        this.state[this.default_column][card.card_id] = card;
        this.table_view.onNewCardReceived(card);
    },

    _onMoveCard: function (data) {
        var card, new_column_id, column_id;

        card = data[0];
        new_column_id = data[1];

        // Remove this card from all existing columns
        for(column_id in this.state ) {
            if( this.state.hasOwnProperty(column_id) ) {
                delete this.state[column_id][card.card_id];
            }
        }

        // Put it in the new column
        this.state[new_column_id][card.card_id] = card;

        // Update the view
        this.table_view.moveCard(card, new_column_id);
    },

    _onConnectionOpened: function (session) {
        console.log("Connected.");

        this.session = session;

        // Start just by subscribing to the 'get initial state' event, and then broadcasting an ask for the initial state
        console.log("Getting initial state...");

        this.session.subscribe(
            "com.wikia.estimator.set_initial_state",
            $.proxy(this._onSetInitialState, this)
        ).then(
            $.proxy(this._onSubscribeToSetInitialStateSuccess, this),
            $.proxy(this._onSubscribeToSetInitialStateFailed, this)
        );

        this.session.subscribe(
            "com.wikia.estimator.clear_board",
            $.proxy(this._onClearBoard, this)
        ).then(
            $.proxy(this._onSubscribeToClearBoardSuccess, this),
            $.proxy(this._onSubscribeToClearBoardError, this)
        );

        // We may be the first person in, in which case we should wait a few seconds before setting up
        this.initial_timeout = setTimeout($.proxy(this._onSetInitialState, this, [this.state]), 5000);
    },

    _onSubscribeToSetInitialStateSuccess: function (subscription) {
        this.subscription_set_initial_state = subscription;
        this.session.publish("com.wikia.estimator.request_initial_state", []);
    },

    _onSubscribeToSetInitialStateFailed: function(error) {
        console.log("Unable to subscribe to set_initial_state:" + error);
    },

    _onConnectionClosed: function (reason) {
        alert("Sorry, but the connection was closed.  This was the reason given:" + reason);
    },

    addNewCard: function(card) {
        this._onNewCard([card]);
        this.session.publish("com.wikia.estimator.new_card", [card]);
    },

    onCardMoved: function(card, new_column_id) {
        this._onMoveCard([card, new_column_id])
        this.session.publish("com.wikia.estimator.move_card", [card, new_column_id]);
    },

    clearBoard: function() {
        this.session.publish("com.wikia.estimator.clear_board");
        this._onClearBoard();
    },

    _onClearBoard: function() {
        this._initState();
        this.table_view.onClearBoard();
    },

    _onSubscribeToClearBoardSuccess: function() {
        // Intentionally do nothing
    },

    _onSubscribeToClearBoardError: function(error) {
        console.log("Unable to subscribe to clear board event:" + error);
    }
});


function main() {
    var main_state;

    main_state = new CardState();
    main_state.start();
}

$(main);
