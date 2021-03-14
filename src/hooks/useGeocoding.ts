import { useState, useEffect } from 'react';
import { not, includes, compose, toLower, difference } from 'ramda';

import { Coordinates } from '@interfaces/index';
import { geocodeLocations } from '@services/GeoDataService';

const notNoOfficeLocation = compose(not, includes('no office'), toLower);

export const useGeocoding = (
    locations: string[],
    options?: {
        onNext?: (data: [loc: string, coords: Coordinates]) => void;
        onFinish?: () => void;
        onStart?: (locs: string[]) => void;
    }
) => {
    const [isInProgress, setIsInProgress] = useState(false);

    const [geocodedItems, setGeocodedItems] = useState<{ [key: string]: Coordinates }>({});

    const handleNext = ([loc, coords]: [string, Coordinates]) => {
        setGeocodedItems((items) => ({ ...items, [loc]: coords }));
        options?.onNext?.([loc, coords]);
    };

    const handleFinish = () => {
        setIsInProgress(false);
        options?.onFinish?.();
    };

    const handleStart = (locs: string[]) => {
        setIsInProgress(true);
        options?.onStart?.(locs);
    };

    useEffect(() => {
        const changedLocations = difference(
            locations.filter(notNoOfficeLocation),
            Object.keys(geocodedItems)
        );

        if (!isInProgress && locations.length && changedLocations.length) {
            geocodeLocations(changedLocations, handleNext, handleStart, handleFinish);
        }
    }, [locations]);

    return {
        geocodedItems,
    };
};
