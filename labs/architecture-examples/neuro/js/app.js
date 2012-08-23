(function( window ) {
	'use strict';

    var App = new Class({
        Extends: Neuro.View,

        _filter: undefined,

        templates: {},

        views: {},

        options: {
            templates: {
                todoItem: document.id('todoItemTemplate'),
                todoCount: document.id('todoCount'),
                todoCompleted: document.id('todoCompleted')
            }
        },

        setup: function(){
            this.parent.apply(this, arguments);

            this.setupTemplates();

            // Create and store the collection
            var collection = this.collection = new Todo.Collection.TodoList([], {
                connector: {
                    add: '_addTodo'
                    , change: 'render'
                    , 'change:model': 'render'
                }
            });
            
            // connect the collection "this"
            collection.connect(this);

            var views = this.views;

            // hookup Input View with the collection
            var input = views.input = new Todo.View.Input({
                element: 'new-todo',
                connector: {
                    'keyup:enter': '_inputKeyEnter'
                }
            });

            input.connect(this);

            var main = views.main = new Todo.View.Main({
                element: 'main',
                events: {
                    'click:relay(#toggle-all)': this.bound('_onClickComplete')
                },
                todoItemTemplate: this.templates.todoItem
            });

            main.connect(this);

            var footer = views.footer = new Todo.View.Footer({
                element: 'footer',
                events: {
                    'click:relay(#clear-completed)': this.bound('_onClickClearCompleted')
                },
                connector: {
                    'filter': '_onClickFilter'
                },
                todoCountTemplate: this.templates.todoCount,
                todoCompletedTemplate: this.templates.todoCompleted
            });

            footer.connect(this);

            return this;
        },

        setupTemplates: function(){
            Object.each(this.options.templates, function(template, key){
                switch(typeOf(template)){
                    case 'element':
                        this.templates[key] = template.get('text');
                        break;
                    case 'string':
                        this.templates[key] = template;
                }
            }, this);

            return this;
        },

        renderMain: function(collection){
            this.views.main.render(collection, this._filter);

            return this;
        },

        renderFooter: function(collection){
            this.views.footer.render(collection);

            return this;
        },

        render: function(collection){
            this.renderMain(collection);
            
            this.renderFooter(collection);

            this.parent(collection);

            return this;
        },

        _inputKeyEnter: function(value){
            this.collection.add({
                id: String.uniqueID(),
                title: value
            });

            return this;
        },

        _addTodo: function(collection, model){
            this.views.main.addTodo(model);

            return this;
        },

        _onClickComplete: function(e, element){
            var checked = element.get('checked'),
                collection = this.collection;

            this.collection.invoke('set', 'completed', checked);

            this.render(this.collection);

            return this;
        },

        _onClickClearCompleted: function(e, element){
            this.collection.clearCompleted();

            return this;
        },

        _onClickFilter: function(filter){
            this._filter = filter;

            this.renderMain(this.collection);

            return this;
        }
    });

    window.App = new App({element: 'todoapp'});

})( window );