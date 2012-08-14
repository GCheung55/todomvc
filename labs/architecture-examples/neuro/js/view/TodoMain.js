(function( window ) {
    'use strict';

    var Todo = window.Todo || (window.Todo = {View: {}}),
        View = Todo.View;
    
    var TodoMain = new Class({
        Extends: Neuro.View,

        options: {
            todoItemTemplate:'',

            elements: {
                toggleAll: 'toggle-all',
                list: 'todo-list'
            },

            events: {
                'click:relay(#toggle-all)': 'onClickToggleAll'
            },

            collection: undefined,

            connector: {
                collectionToMain: {
                    toggleComplete: 'setAll',
                    filterBy: 'filterBy'
                },
                mainToFooter: {
                    triggerFilter: 'onTriggerFilter'
                }
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

            model.set('view', todoItem);

            todoItem.connect(model, true);

            todoItem.render(model);

            // todoItem.inject(this.elements.list);
            this.fireEvent('triggerFilter');
        },

        uncheckComplete: function(){
            this.elements.toggleAll.set('checked');

            return this;
        },

        checkComplete: function(){
            this.elements.toggleAll.set('checked', 'checked');

            return this;
        },

        filterBy: function(models){
            var elements;

            this.elements.list.empty();

            elements = models.map(function(model){return model.get('view').toElement();});

            this.elements.list.adopt(elements);

            return this;
        },

        toggleComplete: function(bool){
            this[(bool ? '' : 'un') + 'checkComplete']();

            return this;
        },

        onFilterBy: function(type){
            this.fireEvent('filterBy', type.toLowerCase());

            return this;
        },

        onClickToggleAll: function(e, element){
            this.fireEvent('toggleComplete', ['completed', element.get('checked')]);

            return this
        },

        onToggleComplete: function(collection){
            var complete = collection.every(function(model){ return !!model.get('completed'); });

            this.toggleComplete(complete);

            return this;
        },

        onToggleMain: function(collection){
            var show = !!collection.length;
            
            this.toggleMain(show);

            return this;
        },

        onAddTodo: function(collection, model){
            this.addTodo(model);

            return this;
        }
    });
    
    View.TodoMain = TodoMain;

})( window );