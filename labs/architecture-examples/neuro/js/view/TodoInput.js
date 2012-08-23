/* global Neuro, App */
/* jshint mootools:true */
(function( window ) {
    'use strict';

    var Todo = window.Todo || (window.Todo = {View: {}}),
        View = Todo.View;

    /**
     * A View class to handle events associated with the creation of new Todo items
     * @type {Class}
     */
    var Input = new Class({
        Extends: Neuro.View,

        options: {
            /**
             * Event types / method names.
             * Event types refer to the event to attach to the root element
             * Method names refer to the method on this View class.
             */
            events: {
                keyup: '_keyup'
            }
        },

        _keyup: function(e, element){
            var key = e.key,
                canReset = key == 'enter' || key == 'esc';

            // Add a todo item on enter keypress
            if (key == 'enter') {
                this.enter();
            }

            // Reset the input by removing the value
            // if the key is enter or esc.
            canReset && this.reset();
        },

        enter: function(){
            var value = this.element.get('value');

            this.fireEvent('keyup:enter', [value]);

            return this;
        },

        reset: function(value){
            this.element.set('value', value);

            this.fireEvent('keyup:reset', value);

            return this;
        }
    });

    View.Input = Input;

})( window );