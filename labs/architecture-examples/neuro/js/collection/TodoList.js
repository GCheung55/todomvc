/* global Neuro, App */
/* jshint mootools:true */

(function( window ) {
    'use strict';

    var Todo = window.Todo || (window.Todo = {Collection: {}}),
        Collection = Todo.Collection;

    // Used to test a non-empty string
    var strValidator = function(str){ 
        return Type.isString(str) && str.length 
    };

    /**
     * Collection of Todo items
     * @type {Class}
     */
    var TodoList = new Class({
        Extends: Neuro.Collection,

        options: {
            primaryKey: 'id',
            Model: Todo.Model.TodoListItem,
            modelOptions: {
                defaults: {
                    id: '',
                    title: '',
                    completed: false
                }
            },
            validators: {
                id: strValidator,
                title: strValidator,
                completed: Type.isBoolean
            },
            connector: {
                collectionToMain: {
                    'add': ['onAddTodo', 'onToggleMain', 'onToggleComplete'],
                    'remove': ['onToggleMain', 'onToggleComplete'],
                    'change:model': 'onToggleComplete',
                    'filterBy': 'filterBy'
                },
                collectionToFooter: {
                    'change': 'onToggleFooter',
                    'change:model': 'onToggleFooter'
                }
            }
        },

        filterTypes: {
            active: function(model){
                return !model.get('completed');
            },

            completed: function(model){
                return model.get('completed');
            }
        },

        setAll: function(prop, value){
            this.each(function(model){
                model.set(prop, value);
            });

            return this;
        },

        removeTodo: function(id){
            var model = this.filter(function(m){ return m.get('id') == id; });

            if (model) {
                this.remove(model);
            }

            return this;
        },

        clearCompleted: function(){
            /**
             * Filter creates a new array of models that match
             *
             * Otherwise, doing an forEach would affect the original
             * array of models and destorying a model from the 
             * original array prevents continuation of the forEach loop.
             */
            this.filter(function(model){
                return model.get('completed');
            }).each(function(model){
                model.destroy();
            });

            return this
        },

        filterBy: function(type){
            var filtered = type ? this.filter(this.filterTypes[type]) : this._models

            this.fireEvent('filterBy', [filtered]);
            
            return filtered;
        }
    });

    Collection.TodoList = TodoList;

})( window );