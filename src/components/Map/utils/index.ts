import { IJobCard, LocationJobDict, JobPoint } from '@interfaces/index';

export const filterNoLocationItems = (
    filter: (items: IJobCard[]) => IJobCard[],
    items: LocationJobDict
) =>
    Object.keys(items).reduce((acc, locKey) => {
        const filtered = filter(items[locKey]);

        return filtered.length ? { ...acc, [locKey]: filtered } : acc;
    }, {});

export const filterJobPoints = (filter: (items: IJobCard[]) => IJobCard[], points: JobPoint[]) =>
    points.reduce((acc, item) => {
        const filtered = filter(item.jobs);
        return filtered.length ? [...acc, { ...item, jobs: filtered }] : acc;
    }, [] as JobPoint[]);
