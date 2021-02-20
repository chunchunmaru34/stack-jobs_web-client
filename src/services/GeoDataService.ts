import axios from 'axios';

import { CityCoordinatesMap } from '@interfaces/index';
import { wrapWithMaybe } from 'utils/async';

const serverUrl = 'http://localhost:1488/api/v1';

export async function getCityCoordinates() {
    const fetch = () =>
        axios.get(`${serverUrl}/city-coords`).then((res) => res.data as CityCoordinatesMap);

    return wrapWithMaybe(fetch)();
}
