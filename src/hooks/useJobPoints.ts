import { useEffect, useState, useCallback } from 'react';

import { JobPoint, LocationJobDict } from '@interfaces/index';
import { getJobPoints } from '@services/JobsService';

export const useJobPoints = () => {
    const [points, setPoints] = useState<JobPoint[]>([]);
    const [noLocationFoundItems, setNoLocationFoundItems] = useState<LocationJobDict>({});

    const getData = useCallback(() => {
        getJobPoints().then((data) => {
            if (data.isJust) {
                const { points, locationNotIdentifiedItems } = data.getValue()!;
                setPoints(points);
                setNoLocationFoundItems(locationNotIdentifiedItems);
            }
        });
    }, []);

    useEffect(() => {
        getData();
    }, [getData]);

    return {
        points,
        noLocationFoundItems,
        refresh: getData,
    };
};
