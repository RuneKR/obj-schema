import { schemaTypes } from './lib';

// SingleElementDefinition or SchemaValidation
export function setType(...types: Array<any | { [key: string]: any }>): any {

    if (types.length == 0) {
        throw new Error('Missing types');
    }

    // check length if one
    if (types.length == 1) {

        // prepre to check if validate key exists
        let keys: any = Object.keys(types[0]);

        // check if vlidate key exists
        if ((typeof types[0][keys[0]] === 'object')
            && ('validate' in types[0][keys[0]])
            && (typeof types[0][keys[0]]['validate'] === 'function')) {
            return new schemaTypes.SchemaMultiKey(types[0]);
        } else {
            return new schemaTypes.SchemaKey(types[0]);
        }
    } else {
        return new schemaTypes.SchemaMultiType(types);
    }
}