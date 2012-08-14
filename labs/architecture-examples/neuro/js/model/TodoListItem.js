/* global Neuro, App */
/* jshint mootools:true */

(function( window ) {
    'use strict';

    var Todo = window.Todo || (window.Todo = {Model: {}}),
        Model = Todo.Model;

    var TodoListItem = new Class({
        Extends: Neuro.Model,

        options: {
            connector: {
                /**
                 * Connect the change:title event with Views/TodoListItem.updateTitle method
                 * change:title will pass the model, property, and value to the method
                 */
                'change:title': 'updateTitle',
                'change:completed': 'onUpdateComplete',
                'destroy': 'destroy'
            }
        }
    });

    Model.TodoListItem = TodoListItem;

})( window );