export function isSchema(subject: any): Boolean {
    if (('validate' in subject) && (typeof subject['validate'] === 'function')) {
        return true;
    } else {
        return false;
    }
}

export function isDefinition(subject: any): Boolean {

    if (typeof subject['numValues'] === 'number') {
        return true;
    } else {
        return false;
    }
}
