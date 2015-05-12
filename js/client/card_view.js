"use strict";

var CardView = new JS.Class({
    initialize: function (card_data) {
        var card_text, move_count;

        this.card_data = card_data;
        this.container = $("<div/>").addClass("card");

        // Set up the parts of the card
        card_text = $("<div/>").addClass("card_text");
        this.container.append(card_text);

        move_count = $("<div/>").addClass("move_count");
        this.container.append(move_count);
    },

    draw: function () {
        this.container.attr("card_id", this.card_data.card_id);
        this.container.find(".card_text").text(this.card_data.title);
        this.container.find(".move_count").text(this.card_data.move_count);
    },

    highlightMove: function () {
        this.container.stop().css('background-color', 'red');
        this.container.animate({backgroundColor: 'white'}, 1000);
    },

    highlightNew: function () {
        this.container.stop().css('background-color', 'green');
        this.container.animate({backgroundColor: 'white'}, 1000);
    }
});