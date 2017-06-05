import { SingleElementDefinition, SchemaValidation } from './interfaces';
import { erros } from './errors';
import { isSchema, isDefinition } from './is-schema';

export namespace schemaTypes {

    export class SchemaKey implements SchemaValidation {
        /**
         * Definition for key
         */
        keydef: SingleElementDefinition
        /**
         * Constructs values can have
         */
        constructor(keydef: SingleElementDefinition) {

            // check that it is actually a definition
            if (!isDefinition(keydef)) {
                throw new Error(erros.NOT_DEFINITION);
            }

            if (keydef.customValidator) {
                this.validateValue = keydef.customValidator;
                delete keydef.customValidator;
            }

            this.keydef = keydef;
        }
        validate(data: Array<any> | any, strictmode?: boolean): any {

            // holder for output
            let out: any;

            // try to validate the value
            try {

                // check if strict mode is on
                if (data === undefined && strictmode === false) {

                    // just return the data
                    out = undefined;

                    // check if array
                } else if ((this.keydef.maxNumValues !== undefined && this.keydef.maxNumValues > 1) || this.keydef.numValues > 1) {

                    // if field is not required then an undefined value might be passed and this needs to be corrected
                    if (this.keydef.numValues === 0 && data === undefined) {
                        data = [];
                    }

                    // check that minimum values are supplied
                    if (this.keydef.numValues > data.length) {
                        throw new Error(erros.DATA_TOO_SHORT);
                    }

                    // throw new error if data is not true
                    if (Array.isArray(data) !== true) {
                        throw new Error(erros.DATA_NOT_ARRAY);
                    }

                    // check length
                    if (this.keydef.maxNumValues !== undefined && data.length > this.keydef.maxNumValues) {
                        throw new Error(erros.DATA_TOO_LONG);
                    }

                    // create holder for output values
                    out = [];

                    // check the values are okay
                    for (let subdata of data) {

                        // check that value is okay
                        out.push(this.validateValue(subdata));
                    }
                } else {

                    out = this.validateValue(data);
                }
            } catch (err) {

                // check if any data is supplied and if it is required to be
                if (data === undefined && this.keydef.numValues != 0 && strictmode !== false) {
                    throw new Error(erros.DATA_REQUIRED);
                } else {
                    throw err;
                }
            }

            return out;
        }
        // validate the actual value
        validateValue(value: any): any {

            // set output
            let out;

            // check that valueset is defined
            if (this.keydef.valueset) {

                // safegard for some values null and undefined
                if (value === undefined) {
                    value = 'undefined';
                } else if (value === null) {
                    value = 'null';
                }

                // check if stringified key is not in dataset (isBoolean and number string?)
                if ((value.toString() in this.keydef.valueset !== true)) {

                    throw new Error(erros.NOT_IN_VALUESET);
                }

                // set value of out from the valueset
                out = this.keydef.valueset[value.toString()];

            } else {

                out = value;
            }

            return out;
        }
    }

    export class SchemaMultiKey implements SchemaValidation {
        private type: { [key: string]: SchemaKey };
        constructor(type: { [key: string]: SchemaKey }) {

            // prepare found erros
            let foundErros: any = {};

            // check the keys to see if they needs to be build
            for (let test in type) {

                if (isDefinition(type[test])) {

                    foundErros[test] = new Error(erros.NOT_SCHEMA);
                }
            }

            // check length of errors
            if (Object.keys(foundErros).length != 0) {
                throw foundErros;
            }

            this.type = type;

        }
        validate(data: any, strictmode?: boolean) {

            // loop all the tests
            let errosFound: any = {};
            let passed: any = {};

            // check datatype is object
            if (typeof data !== 'object') {
                throw new Error(erros.NOT_OBJECT);
            }

            // prepare a source for the data
            let source: any = {};

            // copy object so source not deleted
            for (let key of Object.keys(data)) {
                source[key] = data[key];
            }

            // perform all the tests
            for (let test in this.type) {

                try {

                    // try to perform the validation
                    passed[test] = this.type[test].validate(data[test], strictmode);
                    delete source[test];

                    // check if we can use value for anything
                    if (strictmode === false && data[test] === undefined) {
                        delete passed[test];
                    }

                    // catch the erros
                } catch (e) {
                    errosFound[test] = e;
                    delete source[test];
                }
            }

            // no extra keys should be present
            if (Object.keys(source).length !== 0) {

                for (let key of Object.keys(source)) {
                    errosFound[key] = new Error(erros.KEY_NOT_IN_OBJECT);
                }
            }

            // if any erros are made throw them
            if (Object.keys(errosFound).length != 0) {
                throw errosFound;
                // else throw all the erros back
            } else {
                return passed;
            }
        }
    }

    /**
     * Schema to handle if multiple types are involved
     */
    export class SchemaMultiType implements SchemaValidation {
        private tests: Array<SchemaValidation>;
        // SingleElementDefinition or SchemaValidation
        constructor(types: Array<any>) {

            // initate
            this.tests = [];

            for (let sometype of types) {

                // if it already is a schema then just push it to the tests
                if (isSchema(sometype)) {

                    this.tests.push(sometype);

                } else if (!isDefinition(sometype)) {
                    this.tests.push(new SchemaMultiKey(sometype));
                } else {
                    this.tests.push(new SchemaKey(sometype));
                }
            }
        }
        validate(data: any, strictmode?: boolean) {

            // loop all the tests
            let erros = [];
            let passed = [];

            // perform all the tests
            for (let test of this.tests) {

                try {

                    // try to perform the validation
                    passed.push(test.validate(data, strictmode));

                    // catch the erros
                } catch (e) {
                    erros.push(e);
                }
            }

            // check anything passed and return the first value passed
            if (passed.length != 0) {
                return passed[0];
                // else throw all the erros back
            } else {

                throw erros;
            }
        }
    }
}
