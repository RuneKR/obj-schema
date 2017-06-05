import { schemaTypes, isSchema, isDefinition, erros } from './lib';

// SingleElementDefinition or SchemaValidation
export function setType(...types: Array<any | { [key: string]: any }>): any {

    // return that no types are defined
    if (types.length == 0) {
        throw new Error(erros.NO_TYPES);
    }

    // check if only one type is defined
    if (types.length == 1) {

        // if a schema is actually provided
        if (isSchema(types[0])) {

            // then just return that already
            return types[0];

            // if its not a definition then it must be a multikey
        } else if (!isDefinition(types[0])) {
            return new schemaTypes.SchemaMultiKey(types[0]);
        } else {
            return new schemaTypes.SchemaKey(types[0]);

        }
        
    } else {

        // build multiple type test
        return new schemaTypes.SchemaMultiType(types);
    }
}