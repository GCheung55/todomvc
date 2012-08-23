(function( window ) {
    'use strict';

    var Todo = window.Todo || (window.Todo = {View: {}}),
        View = Todo.View;
    
    var Main = new Class({
        Extends: Neuro.View,

        options: {
            todoItemTemplate:'',

            elements: {
                toggleAll: 'toggle-all',
                list: 'todo-list'
            }
        },

        setup: function(options){
            this.parent(options);

            this.elements = {
                toggleAll: document.id(this.options.elements.toggleAll),
                list: document.id(this.options.elements.list)
            };
        },

        showMain: function(){
            this.element.removeClass('hidden');

            return this;
        },

        hideMain: function(){
            this.element.addClass('hidden');

            return this;
        },

        toggleMain: function(bool){
            this[(bool ? 'show' : 'hide') + 'Main']();

            return this;
        },

        addTodo: function(model){
            var todoItem = new View.TodoListItem({
                template: this.options.todoItemTemplate
            });

            todoItem.connect(model, true);

            todoItem.render(model);

            model.silence(function(){
                model.set('view', todoItem);
            });

            return this;
        },

        uncheckCompleted: function(){
            this.elements.toggleAll.set('checked');

            return this;
        },

        checkCompleted: function(){
            this.elements.toggleAll.set('checked', 'checked');

            return this;
        },

        toggleCompleted: function(bool){
            this[(bool ? '' : 'un') + 'checkCompleted']();

            return this;
        },

        render: function(collection, filterType){
            var elements,
                completeCount = collection.countCompleted(),
                count = collection.length;

            this.toggleCompleted(completeCount == count);

            this.toggleMain(count);

            this.elements.list.empty();

            elements = collection.filterBy(filterType).invoke('get', 'view');

            this.elements.list.adopt(elements);

            return this.parent.apply(this, arguments);
        }
    });
    
    View.Main = Main;

})( window );