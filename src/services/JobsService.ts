import axios from 'axios';
import { groupBy, prop, uniqBy } from 'ramda';

import { IJobCard, JobPoint, LocationJobDict } from '@interfaces/index';
import { Maybe } from '@models/Maybe';

import { getCityCoordinates } from './GeoDataService';
import { wrapWithMaybe } from 'utils/async';

const serverUrl = 'http://localhost:1488/api/v1';

export async function getJobs() {
    const fetch = () => axios.get(`${serverUrl}/jobs`).then((res) => res.data as IJobCard[]);

    return wrapWithMaybe(fetch)();
}

type JobPointsResult = {
    points: JobPoint[];
    locationNotIdentifiedItems: LocationJobDict;
};
export async function getJobPoints() {
    return Promise.all([getJobs(), getCityCoordinates()]).then(([maybeItems, maybeLocations]) => {
        if (maybeItems.isNothing || maybeLocations.isNothing) {
            return Maybe.Nothing<JobPointsResult>();
        }

        const [items, locations] = [maybeItems.getValue()!, maybeLocations.getValue()!];

        const groupedByLocation = groupBy(prop('companyLocation'), items);

        const locationNotIdentifiedItems = Object.keys(groupedByLocation)
            .filter((key) => !locations[key])
            .reduce((acc, loc) => ({ ...acc, [loc]: groupedByLocation[loc] }), {});

        const points = Object.entries(groupedByLocation).reduce((acc, [location, item]) => {
            const locationItem = locations[location];
            if (!locationItem) {
                return acc;
            }
            const { lng, lat } = locationItem;
            const coordinates = { lng, lat };
            return acc.concat({ coordinates, jobs: uniqBy(prop('jobId'), item) });
        }, [] as JobPoint[]);

        // to prevent duplicate markers if location is named differently but still the same for different points
        const groupedByCoords = groupBy(
            (point) => `${point.coordinates.lat}.${point.coordinates.lng}`,
            points
        );

        const noDuplicatesPoints: JobPoint[] = Object.values(groupedByCoords).flatMap((items) =>
            items.length > 1
                ? { coordinates: items[0].coordinates, jobs: items.flatMap((item) => item.jobs) }
                : items
        );

        return Maybe.Just({ points: noDuplicatesPoints, locationNotIdentifiedItems });
    });
}
