import { SingleElementDefinition } from './lib';
import { setType } from './set-type';

export namespace dataTypes {

    export const OneKey: SingleElementDefinition = {
        valueset: { true: true, false: false },
        numValues: 1,
        maxNumValues: 2
    }

    export const OneKeyMinMany: SingleElementDefinition = {
        valueset: { true: true, false: false },
        numValues: 2
    }

    export const OneKeyOneValue: SingleElementDefinition = {
        valueset: { true: true, false: false },
        numValues: 1,
        maxNumValues: 1
    }

    export const Custom: SingleElementDefinition = {
        valueset: { true: true, false: false },
        numValues: 1,
        maxNumValues: 1,
        customValidator: (data: any) => {

            // this validator just lets everything pass
            return data;
        }
    }

    export const ChildToParent = setType(dataTypes.OneKey);

    export const MultiKey = {
        handsome: setType(dataTypes.OneKeyOneValue),
        pretty: setType({
            valueset: { true: true, false: false },
            numValues: 1,
            maxNumValues: 2
        })
    }
}