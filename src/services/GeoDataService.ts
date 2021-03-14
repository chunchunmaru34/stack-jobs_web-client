import { Coordinates } from './../interfaces/index';
import axios from 'axios';

import { CityCoordinatesMap } from '@interfaces/index';
import { wrapWithMaybe } from 'utils/async';

const serverUrl = 'http://localhost:1488/api/v1';
const wsServer = 'ws://localhost:1488/api/v1';

export async function getCityCoordinates() {
    const fetch = () =>
        axios.get(`${serverUrl}/city-coords`).then((res) => res.data as CityCoordinatesMap);

    return wrapWithMaybe(fetch)();
}

export async function geocodeLocations(
    locations: string[],
    onNext: (data: [loc: string, coords: Coordinates]) => void,
    onStart: (loc: string[]) => void,
    onFinish: () => void
) {
    const socket = new WebSocket(wsServer);

    socket.onmessage = (ev) => {
        try {
            const response = JSON.parse(ev.data);
            if (response.event === 'geocode') {
                onNext?.(response.data);
            }
            if (response.event === 'geocode-finish') {
                socket.close();
                onFinish?.();
            }
        } catch (error) {
            console.log(`Error parsing ${ev.data}`);
        }
    };

    const request = {
        event: 'geocode',
        data: locations,
    };

    socket.onopen = () => {
        onStart?.(locations);
        socket.send(JSON.stringify(request));
    };
}
