import { Pojo } from "./types";

export const matchValue = /value\((.*?)\)/g

export function valueTemplate(value: string, data: Pojo, debug: boolean = false, throwCondition = 0): string {
    return value.replace(matchValue, function (match: string, name: string) {
        let translatedValue;
        if (~name.indexOf(',')) {
            const nameParts = name.split(',');
            const variableName = nameParts[0].trim();
            let defaultValue = nameParts[1].trim();
            defaultValue = data[defaultValue] || defaultValue;
            translatedValue = data[variableName] || defaultValue;
        } else {
            translatedValue = data[name];
        }
        if (throwCondition > 10 || translatedValue === undefined) { throw new Error('Unresolvable variable: ' + name) }
        const res = valueTemplate(translatedValue, data, debug, throwCondition + 1);
        return res !== undefined ? res + (debug ? `/*${name}*/` : '') : match;
    });
}

export function valueReplacer(value: string, data: Pojo, onMatch: (value: string, name: string, match: string) => any, debug: boolean = false): string {
    return value.replace(matchValue, function (match: string, name: string) {
        const translatedValue = onMatch(data[name], name, match);
        return translatedValue !== undefined ? translatedValue + (debug ? `/*${name}*/` : '') : match;
    });
}