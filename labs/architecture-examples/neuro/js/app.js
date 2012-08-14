(function( window ) {
	'use strict';

    // Todo object is necessary to continue
    if (!window.Todo) {
        return; 
    }

    var Todo = window.Todo,
        View = Todo.View,
        Collection = Todo.Collection,
        Model = Todo.Model;

    var App = {
        // Initialize the App
        init: function(){
            this.setupCollections();
            this.setupViews();
            this.connectObjects();
        },

        setupCollections: function(){
            // Initialize and store the collections
            this.collection =  {
                list: new Collection.TodoList()
            };
        },

        setupViews: function(){
            // Initialize and store the views
            this.view = {
                main: new View.TodoMain({
                    element: 'main',
                    todoItemTemplate: document.id('todoItemTemplate').get('text')
                }),
                input: new View.TodoInput({
                    element: 'new-todo'
                }),
                footer: new View.TodoFooter({
                    element: 'footer',
                    todoCountTemplate: document.id('todoCount').get('text'),
                    todoCompletedTemplate: document.id('todoCompleted').get('text')
                })
            };
        },

        /**
         * Bind one objects events to another.
         */
        connectObjects: function(){
            var twoWay = true,
                view = this.view,
                collection = this.collection;

            // Connect the view input's events to collection list's methods
            view.input.connect(collection.list, 'collectionToInput');

            // Connect the view footer's events to collection list's methods
            // This one will connect both ways.
            view.footer.connect(collection.list, 'collectionToFooter', twoWay);
            view.footer.connect(view.main, 'mainToFooter', twoWay);

            // Connect the collection list's events to the view list's methods
            collection.list.connect(view.main, 'collectionToMain', twoWay);
        }
    };

    App.init();

    window.App = App;

})( window );