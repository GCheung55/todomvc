(function( window ) {
    'use strict';

    var Todo = window.Todo || (window.Todo = {View: {}}),
        View = Todo.View;

    var TodoFooter = new Class({
        Extends: Neuro.View,

        options: {
            elements: {
                count: 'todo-count',
                clearCompleted: 'clear-completed',
                currentFilter: 'a.selected'
            },

            events: {
                'click:relay(#clear-completed)': 'onClearCompleted',
                'click:relay(#filters a)': 'onFilter'
            },

            todoCountTemplate: '',
            todoCompletedTemplate: '',

            connector: {
                collectionToFooter: {
                    'clearCompleted': 'clearCompleted'
                },
                mainToFooter: {
                    'filter': 'onFilterBy'
                }
            }
        },

        setup: function(options){
            this.parent(options);

            this.elements = {
                count: document.id(this.options.elements.count),
                clearCompleted: document.id(this.options.elements.clearCompleted),
                currentFilter: this.element.getElement(this.options.elements.currentFilter)
            };
        },

        toggleFooter: function(bool){
            this.element[bool ? 'removeClass' : 'addClass']('hidden');

            return this;
        },

        clearCompleted: function(){
            this.fireEvent('clearCompleted');

            return this;
        },

        onTriggerFilter: function(){
            var filter = this.elements.currentFilter.get('href').replace('#/', '');

            this.fireEvent('filter', filter);

            return this;
        },

        onFilter: function(e, element){
            this.elements.currentFilter.removeClass('selected');

            this.elements.currentFilter = element.addClass('selected');

            var filter = element.get('href').replace('#/', '');

            this.fireEvent('filter', filter);
        },

        onToggleFooter: function(collection){
            var count = this.options.todoCountTemplate.substitute({
                count: collection.length
            });

            this.elements.count.set('html', count);

            var cleared = this.options.todoCompletedTemplate.substitute({
                completed: collection.filter(function(model){return model.get('completed');}).length
            });

            this.elements.clearCompleted.set('html', cleared);

            this.toggleFooter(!!collection.length);

            return this;
        },

        onClearCompleted: function(e, element){
            this.clearCompleted();

            return this;
        }
    });

    View.TodoFooter = TodoFooter;

})( window );