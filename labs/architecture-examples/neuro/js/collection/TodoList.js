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
            }
        },

        /**
         * Methods used for filtering in filterBy method
         * @type {Object}
         */
        filterTypes: {
            active: function(model){
                return !model.get('completed');
            },

            completed: function(model){
                return model.get('completed');
            }
        },

        /**
         * Clear (remove) the completed items from the collection. Destroying the model itself automatically removes it from the collection
         * @return {Object} The class instance.
         */
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

        /**
         * Count the number of compeleted items in the collection
         * @return {Number} The number of completed items in the collection
         */
        countCompleted: function(){
            return this.filter(function(model){return model.get('completed');}).length;
        },

        /**
         * Filter the collection by a type.
         * @param  {String} type String refers to a function in filterTypes object that will be used for filtering
         * @return {Array} An array of filtered items or the array of models.
         */
        filterBy: function(type){
            var filtered = type ? this.filter(this.filterTypes[type]) : this._models;
            
            return filtered;
        }
    });

    Collection.TodoList = TodoList;

})( window );