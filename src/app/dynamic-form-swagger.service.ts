import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import 'rxjs/add/operator/map';

import { InputTypeFormatMap } from './constants/input-type-format.map';
import { BasicFormMap } from './constants/basic-form.map';
import { UiNgBootstrapFormMap, UiNgBootstrapTypeMap } from './constants/ui-ng-bootstrap-form.map';

import _ from "lodash";

@Injectable()
export class DynamicFormSwaggerService {
    private swaggerSpecs: any = {};

    constructor( private http: HttpClient ) {

    }

    registerSpec( swaggerUrl: string ): Observable < any > {
        //GET @ swaggerUrl
        return this.http.get < any > ( swaggerUrl ).map( spec => {
            this.swaggerSpecs[ spec.host ] = spec;
            return spec;
        } )
    }

    buildFormModel( host, modelName ) {
        if ( !this.swaggerSpecs[ host ] ) return {};

        return _.flatten( this.buildRecursiveFormModel( this.swaggerSpecs[ host ], modelName ) );
    }

    buildInputModel( inputId, inputType, inputLabel, schema ) {
        let formControl = this.findFormControl( inputType );
        if ( !inputType ) inputType = 'text';

        if ( formControl === 'SELECT' )
            var options = schema.enum.map( val => {
                return { label: val, value: val };
            } )
        
        if ( formControl === 'DATEPICKER' ) {
            var inline = true;
        }


        return new UiNgBootstrapFormMap[formControl]( {
            id: inputId,
            inline: inline,
            label: inputLabel,
            hint: schema.description,
            inputType: inputType,
            required: schema.required,
            maxLength: schema.maxLength,
            minLength: schema.minLength,
            min: schema.minimum,
            max: schema.maximum,
            pattern: schema.pattern,
            readOnly: schema.readOnly,
            options: options
        } );
    }

    private buildLabelAndId(labelSource, idSource, parentLabel, parentId) {
        let defaultLabel = _.startCase( labelSource );
        let defaultId = idSource;
        let label = '';
        let inputId = '';
        // console.log(defaultId);
        if ( parentLabel && parentId ) {
            label = parentLabel + ' ';
            inputId = parentId + '_';
        }

        label += defaultLabel;
        inputId += defaultId;
        return {
            id: inputId,
            label: label
        }
    }

    private buildRecursiveFormModel( swaggerSpec, model, parentLabel?, parentId? ) {
        if (typeof model === 'string') model = swaggerSpec.definitions[ model ];
        return _.map( model.properties, ( schema, inputId ) => {

            if ( schema.$ref ) var reference = this.findReferenceDefinition( swaggerSpec, schema.$ref );

            
            if ( reference && reference.properties ) {
                var defaults = this.buildLabelAndId((schema.title || inputId), inputId, parentLabel, parentId);
                return this.buildRecursiveFormModel( swaggerSpec, reference, defaults.label, defaults.id );
            } else if (reference) {
                schema = reference;
                var defaults = this.buildLabelAndId((schema.title || inputId), inputId, parentLabel, parentId);
            } else {
                var defaults = this.buildLabelAndId((schema.title || inputId), inputId, parentLabel, parentId);
            }
                
            let inputType = this.findInputType( schema );

            //TODO: this causes ExpressionChangedAfterItHasBeenCheckedError
            // if ( model.required ) 
            //     schema.required = model.required.includes(inputId);

            console.log('hit')
            
            return this.buildInputModel( defaults.id, inputType, defaults.label, schema );

        } );
    }

    private findReferenceDefinition( swaggerSpec, $ref ) {
        let path = $ref.replace('#', '').split('/');
        let definition;
        console.log(path);
        path.forEach(p => {
            definition = definition ? definition[p] : swaggerSpec[p];            
        })
        console.log($ref, definition)
        return definition;
    };

    private findInputType( schema ) {
        let inputType;
        _.forEach( InputTypeFormatMap, ( val, key ) => {
            if ( inputType ) return;
            if ( val.includes( schema.format || schema.type ) ) inputType = key;
        } )

        if ( inputType === 'text' && schema.maxLength && schema.maxLength > 100 )
            inputType = 'textarea';

        if ( inputType === 'text' && schema.enum && schema.enum.length )
            inputType = 'select';

        if ( !inputType )
            inputType = 'text';

        return inputType;
    }

    private findFormControl( inputType ) {
        if ( !inputType ) return;
        let formControl;
        _.forEach( UiNgBootstrapTypeMap, ( val, key ) => {
            if ( formControl ) return;
            if ( val.includes( inputType ) ) formControl = key;
        } );

        if ( !formControl )
            console.log( 'Unknown input type', inputType );
        return formControl;
    }


}