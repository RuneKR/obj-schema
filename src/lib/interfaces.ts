export interface SingleElementDefinition {
    [key: string]: any;
    /**
     * Values it can have
     */
    valueset?: { [key: string]: any };
    /**
     * Minimum number of values
     */
    numValues: number;
    /**
     * maximum number of values
     */
    maxNumValues?: number;
    /**
     * Custom value validator
     */
    customValidator?: {(data: any): any}
}

export interface SchemaValidation {
    [key: string]: any;
    validate(data: any, strictmode?: boolean): any
}