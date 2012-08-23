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
                'dblclick:relay(label)': 'onEdit',
                'click:relay(input.toggle)': 'onToggleStatus',
                'click:relay(button.destroy)': 'destroy'
            },
            
            connector: {
                update: 'set',
                toggleStatus: 'set',
                destroy: 'destroy'
            }
        },

        updateTitle: function(model, prop, title){
            if (title != undefined) {
                this.label.set('html', title);
            }

            return this;
        },

        updateComplete: function(bool){
            this.element[bool ? 'addClass' : 'removeClass']('completed');
            this.completedInput.set('checked', bool);
            return this;
        },

        onEdit: function(e, element){
            var value = this._previousTitle = element.get('html');

            this.editInput.set('value', value);

            this.element.addClass('editing');

            this.editInput.fireEvent('focus').focus();

            return this;
        },

        onUpdate: function(e, element){
            var value = element.get('value').trim();
            
            if (value) {
                this.element.removeClass('editing');

                this.fireEvent('update', ['title', value]);
            }

            return this;
        },

        onUpdateComplete: function(model, prop, complete){
            this.updateComplete(complete);

            return this;
        },

        onToggleStatus: function(e, element){
            var hasClass = this.element.hasClass('completed');
            this.updateComplete(hasClass);

            this.fireEvent('toggleStatus', ['completed', !hasClass]);

            return this;
        },

        render: function(model){
            this.connect(model);

            var element = new Element('div', {
                html: this.options.template.substitute(model.getData())
            }).getElement('>');

            this.setElement(element);

            var input = new View.Input({
                element: element.getElement('input.edit'),
                connector: {
                    'keyup:enter': '_onEnter'
                    , 'keyup:reset': '_onReset'
                }
            }).connect(this);

            this.editInput = this.element.getElement('input.edit');

            this.completedInput = this.element.getElement('input.toggle');

            this.label = this.element.getElement('label');

            this.parent(model);

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