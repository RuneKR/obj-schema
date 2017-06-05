import { expect } from 'chai';
import { setType, lib } from './';
import { dataTypes } from './data-types';

describe('Validation', function () {
    it('replace supplied value with that of the valueset', function () {

        let schema = setType(dataTypes.OneKeyOneValue);
        expect(schema.validate('true')).to.equal(true);
    });

    it('checks value is in valueset', function () {

        let schema = setType(dataTypes.OneKeyOneValue);

        expect(() => schema.validate('monkey')).to.throw(Error, lib.erros.NOT_IN_VALUESET);
    });

    it('checks value is array', function () {

        let schema = setType(dataTypes.OneKey);

        expect(() => schema.validate('true')).to.throw(Error, lib.erros.DATA_NOT_ARRAY);
    });

    it('checks if array is too long', function () {

        let schema = setType(dataTypes.OneKey);

        expect(() => schema.validate(['true', 'true', 'true'])).to.throw(Error, lib.erros.DATA_TOO_LONG);
    });

    it('checks if array is too short', function () {

        let schema = setType(dataTypes.OneKeyMinMany);

        expect(() => schema.validate(['true'])).to.throw(Error, lib.erros.DATA_TOO_SHORT);
    });

    it('supports multiple types', function () {

        let schema = setType(dataTypes.OneKey, dataTypes.OneKeyOneValue);
        expect(schema.validate('true')).to.equal(true);
    });

    it('checks a field is required', function () {

        let schema = setType(dataTypes.OneKeyOneValue);

        expect(() => schema.validate()).to.throw(Error, lib.erros.DATA_REQUIRED);
    });
    it('supports multiple fields', function () {

        let schema = setType(dataTypes.MultiKey);

        let obj = { handsome: true, pretty: [true] };
        expect(Object.keys(schema.validate(obj))).to.have.same.members(Object.keys(obj));
    });

    it('blocks nonsupported fields', function () {

        let schema = setType(dataTypes.MultiKey);

        let obj = { handsome: true, pretty: [true], wrongField: true };
        expect(() => schema.validate(obj)).to.throw(Object);
    });

    it('supports custom validators', function () {

        let schema = setType(dataTypes.Custom);
        expect(schema.validate('true')).to.equal('true');
    });

    it('parses schema from child to parent', function () {

        let schema = setType(dataTypes.ChildToParent, dataTypes.OneKeyOneValue);
        expect(schema.validate('true')).to.equal(true);
    });
});