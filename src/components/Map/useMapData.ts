import { useCallback, useMemo, useState } from 'react';

import { filterJobPoints, filterNoLocationItems } from '@components/Map/utils';
import { IMapFilters, JobPoint, LocationJobDict } from '@interfaces/index';
import { Maybe } from '@models/Maybe';

import { useJobFilters } from '@hooks/useJobFilters';
import { useJobPoints } from '@hooks/useJobPoints';

import { useGeocodingWithStatus } from './useGeocodingWithStatus';

type MapData = {
    jobPoints: {
        selectedPoint: Maybe<JobPoint>;
        setSelectedPoint: (p: Maybe<JobPoint>) => void;
        resetPoint: () => void;
        items: JobPoint[];
    };
    filters: {
        items: IMapFilters;
        clearFilters: () => void;
        setFilters: (f: IMapFilters) => void;
    };
    noLocationItems: {
        items: LocationJobDict;
    };
};

export const useMapData = (): MapData => {
    const [selectedPoint, setSelectedPoint] = useState<Maybe<JobPoint>>(Maybe.Nothing());

    const { points, noLocationFoundItems } = useJobPoints();
    const { filters, setFilters, clearFilters, matchList, matchItem } = useJobFilters();
    const { geocodedItems } = useGeocodingWithStatus(Object.keys(noLocationFoundItems));

    const filteredNoLocationItems = useMemo(() => {
        const geocodedKeys = new Set(Object.keys(geocodedItems));
        const noGeocoded = (x: string) => !geocodedKeys.has(x);

        return filterNoLocationItems(noGeocoded, matchItem, noLocationFoundItems);
    }, [noLocationFoundItems, matchList, geocodedItems]);

    const allJobPoints: JobPoint[] = useMemo(
        () =>
            Object.keys(geocodedItems)
                .map((key) => ({
                    jobs: noLocationFoundItems[key],
                    coordinates: geocodedItems[key],
                }))
                .concat(points),
        [noLocationFoundItems, geocodedItems, points]
    );

    const filteredJobPoints = useMemo(() => filterJobPoints(matchList, allJobPoints), [
        allJobPoints,
        matchList,
    ]);

    const resetPoint = useCallback(() => setSelectedPoint(Maybe.Nothing()), []);

    const handleApplyFilters = useCallback((filters: IMapFilters) => {
        resetPoint();
        setFilters(filters);
    }, []);

    return {
        jobPoints: {
            selectedPoint,
            setSelectedPoint,
            resetPoint,
            items: filteredJobPoints,
        },
        filters: {
            items: filters,
            clearFilters,
            setFilters: handleApplyFilters,
        },
        noLocationItems: {
            items: filteredNoLocationItems,
        },
    };
};
