import { IJobCard, LocationJobDict, JobPoint } from '@interfaces/index';

export const filterNoLocationItems = (
    filterKey: (x: string) => boolean,
    filterValue: (items: IJobCard) => boolean,
    items: LocationJobDict
) =>
    Object.keys(items)
        .filter(filterKey)
        .reduce((acc, locKey) => {
            const filtered = items[locKey].filter(filterValue);

            return filtered.length ? { ...acc, [locKey]: filtered } : acc;
        }, {} as LocationJobDict);

export const filterJobPoints = (filter: (items: IJobCard[]) => IJobCard[], points: JobPoint[]) =>
    points.reduce((acc, item) => {
        const filtered = filter(item.jobs);
        return filtered.length ? [...acc, { ...item, jobs: filtered }] : acc;
    }, [] as JobPoint[]);
