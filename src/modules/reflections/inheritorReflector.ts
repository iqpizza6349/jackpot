
export function findInterfaceHeritors<T>(interfaceType: Function): Function[] {
    const classes: Function[] = [];
    for (const key in global) {
        if (global.hasOwnProperty(key)) {
            const obj = global[key];

            if (typeof obj === 'function' && obj.prototype instanceof interfaceType) {
                classes.push(obj);
            }
        }
    }

    return classes;
}
