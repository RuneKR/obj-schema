This project lets you create schemas for your objects and validate a given dataset against that schema

# Using this module
This module exists on npm. To use it run:

```
npm install @ords/obj-schema --save
```

The different erros can be found in:

```typescript
import {errors}            from    '@ords/obj-schema';
```

Check our tests for expected behavior of this module.

# Examples

```typescript
import {setType, lib}            from    '@ords/obj-schema';

// boolean type
let bool: lib.SingleElementDefinition {
    valueset: { true: true, false: false }, // values allowed
    numValues: 1,                           // required number of values
    maxNumValues: 1                         // maximum number of values
}

// custom type
let myCustom: lib.SingleElementDefinition {
    numValues: 0,                          // not required
    maxNumValues: 2                        // maximum length leave empty of unlimited
    customValidator: (data: any) => {
        
            // this validator just lets everything pass
            return data;
        }
}

let CustomGoat = {
    cool: setType(bool)
    coolAndFunny: setType(myCustom)
}

// works with true or 'true' output = true
let schema = setType(bool);
schema.validate('true')

// works with true or 'true' output = ['true', 'true']
let schema = setType(myCustom);
schema.validate(['true', 'true'])

// also works and output is undefined
let schema = setType(myCustom);
schema.validate()

// this works
let schema = setType(CustomGoat);
schema.validate({coolAndFunny: ['true', 'true'], cool: ['true']})

// this doesnt work
let schema = setType(CustomGoat);
schema.validate({keyDoNotExist: ['true', 'true'], cool: ['true']})

```


# Global dependencies
- nodejs
- typescript
- typings
- mocha

# Getting started
Initially install dependencies by running:
```
npm run build-env
```
Whenever you have made changes you can run the following command
```
npm run build-depoly
```
## Scripts
In order to test the project you can now run:
```
npm test
```
To clean the project do:
```
npm run clean
```

# Contribution
Modules can be created seperatly from this core project. These core modules in thie repo implements proposals from the *proposals* directory in [ords-core](https://github.com/MedSolve/ords-core). Essentially all kinds of modules can be created, but modules following the *proposals* will be more interopable. Below are some general rules of code:

- Use camleCase instead of underscore
- Document your code with comments
- Write at least unit tests
- Follow established directory structure

Ideas for naming to and directory structure to keep consistensy *modules/:type/:type.:custom.ts* where type is the type of module and custom can be everything. A mongodb db will be *modules/database/database.mongo.ts* with the class name being *DatabaseMongo*.

# Versioning
We use schemantic versioning. Do no introduce backwards compatible breakable code without upgrading the software version to a major release.