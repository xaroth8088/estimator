var CardView = new JS.Class({
    initialize: function (card_data) {
        this.card_data = card_data;
        this.container = $("<div/>").addClass("card");
    },

    draw: function () {
        this.container.text(this.card_data.title).attr("card_id", this.card_data.card_id);
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