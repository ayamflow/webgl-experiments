define(function() {
    var Mouse = function(x, y) {
        this.x = x;
        this.y = y;

        this.ox = x;
        this.oy = y;

        this.clicks = 0;

        window.addEventListener("mousemove", this.onMouseMove.bind(this));
        window.addEventListener("click", this.onMouseClick.bind(this));
    };

    Mouse.prototype = {
        onMouseMove: function(e) {
            this.ox = this.x;
            this.oy = this.y;
            this.x = e.clientX;
            this.y = e.clientY;
        },

        onMouseClick: function(e) {
            this.clicks++;
        }
    };

    return Mouse;
});