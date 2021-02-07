import { useCallback, useEffect, useMemo, useState } from 'react';
import ReactMapGL from 'react-map-gl';
import { groupBy, prop, uniqBy } from 'ramda';

import { JobPoint } from '@interfaces/index';

import data from '../../locations.json';
import { getJobs } from '../../services/JobsService';
import { JobMarker } from './JobMarker';
import { JobsPopup } from './JobsPopup';
import { useJobDetailsPanel } from 'components/JobDetailsPanel/JobDetailsPanelProvider';

const mapOptions = {
    style: 'mapbox://styles/mapbox/streets-v11',
};

export const Map = () => {
    const [viewport, setViewport] = useState({});

    const [points, setPoints] = useState<JobPoint[]>([]);

    const [selectedPoint, setSelectedPoint] = useState<JobPoint | null>(null);
    const resetPoint = useCallback(() => setSelectedPoint(null), []);

    const { setSelectedJob } = useJobDetailsPanel();

    useEffect(() => {
        getJobs().then((items) => {
            if (!items) {
                return;
            }

            const grouped = groupBy(prop('companyLocation'), items);
            const points = Object.entries(grouped).reduce((acc, [location, item]) => {
                const locationItem = (data as { [key: string]: any })[location];
                if (!locationItem) {
                    return acc;
                }
                const { lng, lat } = locationItem.geometry;
                const coordinates = { lng, lat };
                return acc.concat({ coordinates, jobs: uniqBy(prop('jobId'), item) });
            }, [] as JobPoint[]);

            setPoints(points ?? []);
        });
    }, []);

    const markers = useMemo(
        () =>
            points.map((p, index) => (
                <JobMarker key={index} point={p} onClick={() => setSelectedPoint(p)} />
            )),
        [points]
    );

    return (
        <div style={{ display: 'flex', height: '100vh', width: '100vw' }}>
            <ReactMapGL
                mapboxApiAccessToken={process.env.MAPBOX_TOKEN}
                width="100%"
                height="100%"
                {...viewport}
                mapOptions={mapOptions}
                onViewportChange={setViewport}
            >
                {markers}
                {selectedPoint && (
                    <JobsPopup
                        point={selectedPoint}
                        onJobSelect={setSelectedJob}
                        onClose={resetPoint}
                    />
                )}
            </ReactMapGL>
        </div>
    );
};
