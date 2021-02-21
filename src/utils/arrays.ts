import { reduce, pipe, flatten, map, sort } from 'ramda';

export const getItemsUsages = reduce(
    (acc, item: string) => ({
        ...acc,
        [item]: acc[item] ? acc[item] + 1 : 1,
    }),
    {} as { [key: string]: number }
);

export const countTruthy = reduce((acc, item) => (item ? acc + 1 : acc), 0);

export const uniqByUsageCount = pipe(
    getItemsUsages,
    Object.entries,
    sort((a, b) => b[1] - a[1]),
    map((val) => val[0]),
    flatten
);
