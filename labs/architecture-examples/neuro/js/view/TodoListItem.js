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
                'blur:relay(input.edit)': 'onUpdate',
                'keyup:relay(input.edit)': 'onKeyup',
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

        onKeyup: function(e, element){
            var key = e.key,
                canUpdate = key == 'enter' || key == 'esc';
            
            // Revert to the old value
            if (key == 'esc') {
                element.set('value', this._previousTitle);
            }

            // Update the label
            if (canUpdate) {
                this.element.fireEvent('blur', [e, element]);
                // this.onUpdate(e, element);
            }

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

            this.editInput = this.element.getElement('input.edit');

            this.completedInput = this.element.getElement('input.toggle');

            this.label = this.element.getElement('label');

            this.parent(model);

            return this;
        }
    });

    View.TodoListItem = TodoListItem;

})( window );