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
    var TodoListItem = new Class({
        Extends: Neuro.View,

        _previousTitle: '',

        options: {
            template: '',
            /**
             * Event types / method names.
             * Event types refer to the event to attach to the root element
             * Method names refer to the method on this View class.
             */
            events: {
                'dblclick:relay(label)': '_onEdit',
                'click:relay(input.toggle)': '_onToggleStatus',
                'click:relay(button.destroy)': 'destroy'
            },
            
            connector: {
                update: 'set',
                toggleStatus: 'set',
                destroy: 'destroy'
            }
        },

        /**
         * Mark the element as completed
         * @param  {Boolean} bool Boolean used to add/remove 'completed' class on the element. Also used to check/uncheck the completedInput element
         * @return {Object} The class instance.
         */
        updateComplete: function(bool){
            this.element[bool ? 'addClass' : 'removeClass']('completed');
            this.elements.completed.set('checked', bool);
            return this;
        },

        /**
         * Cleanup the stored elements and trigger the parent method to continue cleanup.
         * Element.destroy will automatically handle destorying child nodes.
         * @return {Object} The class instance.
         */
        destroy: function(){
            Object.map(this.elements, function(val, key, obj){
                return delete obj[key];
            });

            return this.parent.apply(this, arguments);
        },

        /**
         * Render the view.
         * @param  {Object} model The model instance used to render the view.
         * @return {Object} The class instance.
         */
        render: function(model){
            // Connect this view with the model one-way binding.
            this.connect(model);

            // Create a proxy element with the html from the template
            var element = new Element('div', {
                html: this.options.template.substitute(model.getData())
            }).getElement('>');

            // Set the element so that events get attached to it and the element gets stored in the class instance.
            this.setElement(element);

            this.elements = {
                edit: this.element.getElement('input.edit'),
                completed: this.element.getElement('input.toggle'),
                label: this.element.getElement('label')
            };

            // Create an input view to handle keyup events for enter and reset behaviors.
            var input = new View.Input({
                element: this.elements.edit,
                connector: {
                    'keyup:enter': '_onEnter'
                    , 'keyup:reset': '_onReset'
                }
            }).connect(this);

            // Execute the parent method, which will trigger the render event.
            return this.parent(model);
        },

        _onEdit: function(e, element){
            var value = this._previousTitle = element.get('html'),
                editElement = this.elements.edit;

            editElement.set('value', value);

            this.element.addClass('editing');

            editElement.fireEvent('focus').focus();

            return this;
        },

        _onUpdateTitle: function(model, prop, title){
            if (title != undefined) {
                this.elements.label.set('html', title);
            }

            return this;
        },

        _onUpdateComplete: function(model, prop, complete){
            this.updateComplete(complete);

            return this;
        },

        _onToggleStatus: function(e, element){
            var hasClass = this.element.hasClass('completed');
            this.updateComplete(hasClass);

            this.fireEvent('toggleStatus', ['completed', !hasClass]);

            return this;
        },

        _onEnter: function(value){
            if (value) {
                this.fireEvent('update', ['title', value]);
            }

            return this;
        },

        _onReset: function(){
            this.element.removeClass('editing');

            return this;
        }
    });

    View.TodoListItem = TodoListItem;

})( window );