import {
    DynamicCheckboxModel,
    DynamicCheckboxGroupModel,
    DynamicDatePickerModel,
    DynamicFormControlModel,
    DynamicFormGroupModel,
    DynamicInputModel,
    DynamicRadioGroupModel,
    DynamicSelectModel,
    DynamicTextAreaModel,
    DynamicTimePickerModel
} from "@ng-dynamic-forms/core";

export const UiNgBootstrapTypeMap = {
    'INPUT': [ 'integer', 'number', 'text', 'email', 'file', 'password' ],
    'CHECKBOX': [ 'checkbox' ],
    'TEXTAREA': [ 'textarea' ],
    'SELECT': ['select'],
    'DATEPICKER': [ 'date', 'datetime-local' ]
}

export const UiNgBootstrapFormMap = {
    'INPUT': DynamicInputModel,
    'CHECKBOX': DynamicCheckboxModel,
    'TEXTAREA': DynamicTextAreaModel,
    'SELECT': DynamicSelectModel,
    'DATEPICKER': DynamicDatePickerModel
}