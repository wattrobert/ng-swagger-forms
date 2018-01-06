import { Component } from '@angular/core';
import { DynamicFormSwaggerService } from './dynamic-form-swagger.service';
import { DynamicFormService, DynamicInputModel, DynamicSelectModel } from '@ng-dynamic-forms/core';
import _ from "lodash";
import { OnChanges, SimpleChanges } from '@angular/core/src/metadata/lifecycle_hooks';

@Component( {
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: [ './app.component.scss' ]
} )
export class AppComponent {
    title = 'app';
    apiSelectorModel: any;
    apiSelectorGroup: any;
    formModel: any;
    formGroup: any;
    formLayout: any;
    constructor( private dynamicSwaggerForms: DynamicFormSwaggerService, private formService: DynamicFormService ) {
      this.registerSpec('https://api.apis.guru/v2/specs/amazonaws.com/acm/2015-12-08/swagger.json');
    }


    registerSpec(swaggerUrl) {
      this.dynamicSwaggerForms.registerSpec( swaggerUrl ).subscribe( spec => {
        this.apiSelectorModel = [
          new DynamicInputModel({
            id:'SwaggerUrlInput',
            label:'Swagger URL',
            inputType:'text',
            placeholder:'Paste in a swagger url',
            value:swaggerUrl
          }),
          new DynamicInputModel({
            id:'SelectedHost',
            label:'Selected host',
            inputType:'text',
            placeholder:'Swagger spec host',
            value:spec.host
          }),
          new DynamicSelectModel({
            id:'SelectedModel',
            label:'Select a model',
            options: _.map(spec.definitions, (def, key) => {
              return {label:key, value:def};
            })
          })
        ]
        this.apiSelectorGroup = this.formService.createFormGroup( this.apiSelectorModel );
      } );
    }

    showForm() {
      // this.formModel = this.dynamicSwaggerForms.buildFormModel( this.apiSelectorGroup.value.SelectedHost, this.apiSelectorGroup.value.Sele );
      // this.formGroup = this.formService.createFormGroup( this.formModel );
    }

    onChange(data) {
      if (data.$event.target.id === 'SelectedModel') {
        this.formLayout = {
          id: 'col-6',
          kind: 'col-6'
        }
        this.formModel = this.dynamicSwaggerForms.buildFormModel( data.group.value.SelectedHost, data.control.value );
        this.formGroup = this.formService.createFormGroup( this.formModel );
      } else if (data.$event.target.id === 'SwaggerUrlInput') {
        this.formGroup = undefined;
        this.registerSpec(data.control.value);
      } else {
        this.formGroup = undefined;
      }
    }


}