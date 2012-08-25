(function( window ) {
    'use strict';

    var Todo = window.Todo || (window.Todo = {View: {}}),
        View = Todo.View;

    var Footer = new Class({
        Extends: Neuro.View,

        options: {
            elements: {
                count: 'todo-count',
                clearCompleted: 'clear-completed',
                currentFilter: 'a.selected'
            },

            events: {
                'click:relay(#clear-completed)': '_onClickClearCompleted',
                'click:relay(#filters a)': '_onClickFilter'
            },

            todoCountTemplate: '',
            todoCompletedTemplate: ''
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

        updateCount: function(count){
            count = this.options.todoCountTemplate.substitute({
                count: count,
                plural: count == 1 ? '' : 's'
            });

            this.elements.count.set('html', count);

            return this;
        },

        updateCompleted: function(count){
            count = this.options.todoCompletedTemplate.substitute({
                completed: count
            });

            this.elements.clearCompleted.set('html', count);

            return this;
        },

        render: function(collection){
            var count = collection.length,
                completedCount = collection.countCompleted();

            this.updateCount(count - completedCount);
            
            this.updateCompleted(completedCount);

            this.toggleFooter(!!count);

            this.parent(collection);

            return this;
        },

        _onClickFilter: function(e, element){
            this.elements.currentFilter.removeClass('selected');

            this.elements.currentFilter = element.addClass('selected');

            var filter = element.get('href').replace('#/', '');

            this.fireEvent('filter', filter);
        },

        _onClickClearCompleted: function(e, element){
            this.fireEvent('clearCompleted');

            return this;
        }
    });

    View.Footer = Footer;

})( window );