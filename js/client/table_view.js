"use strict";
var TableView = new JS.Class({
    initialize: function (card_state) {
        this.card_state = card_state;
        this.card_views = {};
    },

    initial_draw: function () {
        var column_id, column_data, card_id;

        for (column_id in this.card_state.state) {
            if (this.card_state.state.hasOwnProperty(column_id)) {
                column_data = this.card_state.state[column_id];

                for (card_id in column_data) {
                    if (column_data.hasOwnProperty(card_id)) {
                        this.addNewCardView(column_data[card_id], column_id);
                    }
                }
            }
        }

        // Attach events, controls, etc.
        $(".text_new_card_form").submit($.proxy(this.onNewCardClicked, this));
        $(".button_new_card").click($.proxy(this.onNewCardClicked, this));
        $(".column .container").sortable({
            connectWith: ".column .container",
            cursor: "move",
            containment: "window",
            tolerance: "pointer",
            stop: $.proxy(this.onSortStop, this)
        });
    },

    addNewCardView: function (card, column_id) {
        var card_view;

        card_view = new CardView(card);
        card_view.draw();
        $(".column[value='" + column_id + "'] .container").append(card_view.container);
        card_view.highlightNew();

        this.card_views[card.card_id] = card_view;
    },

    onNewCardClicked: function () {
        var card, title, card_id, new_card_input;

        new_card_input = $('.text_new_card');
        title = new_card_input.val();
        if( title === "" ) {
            return;
        }

        card_id = uuid.v4();

        card = {
            'title': title,
            'card_id': card_id
        };

        new_card_input.val('');

        this.card_state.addNewCard(card);
    },

    onNewCardReceived: function (card) {
        this.addNewCardView(card, this.card_state.default_column);
    },

    onSortStop: function (event) {
        var card_id, new_column_id, card;

        card_id = $(event.toElement).attr('card_id')
        new_column_id = $(event.toElement).parent().parent().attr('value');
        card = this.card_views[card_id].card_data;
        this.card_views[card_id].highlightMove();

        this.card_state.onCardMoved(card, new_column_id);
    },

    moveCard: function (card, new_column_id) {
        var card_view;

        card_view = this.card_views[card.card_id];
        card_view.container.remove();

        $(".column[value='" + new_column_id + "'] .container").append(card_view.container);
        card_view.highlightMove();
    }
});