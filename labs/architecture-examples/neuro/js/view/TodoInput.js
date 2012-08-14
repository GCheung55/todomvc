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
    var TodoInput = new Class({
        Extends: Neuro.View,

        options: {
            /**
             * Event types / method names.
             * Event types refer to the event to attach to the root element
             * Method names refer to the method on this View class.
             */
            events: {
                'keyup': 'onKeyup',
            },
            
            connector: {
                collectionToInput: {
                    /**
                     * Connect addTodo event with Collection add method
                     */
                    'addTodo': 'add'
                }
            }
        },

        onKeyup: function(e){
            var key = e.key,
                canReset = key == 'enter' || key == 'esc';

            // Add a todo item on enter keypress
            if (key == 'enter') {
                this.addTodo();
            }

            // Reset the input by removing the value
            // if the key is enter or esc.
            if (canReset) {
                this.element.set('value');                
            }

            return this;
        },

        addTodo: function(){
            var value = this.element.get('value').trim();
            
            this.fireEvent('addTodo', {
                id: String.uniqueID(),
                title: value
            });

            return this;
        }
    });

    View.TodoInput = TodoInput;

})( window );