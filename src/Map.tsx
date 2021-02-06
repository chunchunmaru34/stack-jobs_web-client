import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import ReactMapGL, { Marker, Popup } from 'react-map-gl';
import { GeoJsonObject } from 'geojson';
import { groupBy, prop, uniqBy } from 'ramda';

import data from './locations.json';
import { DbService } from './services/DbService';
import { IRecord } from '@chunchun-db/client';

type LocationMap = { [key: string]: GeoJsonObject };

type JobCard = {
    jobId: number;
    companyLocation: string;
    jobTitle: string;
};

type JobPoint = {
    coordinates: {
        lng: number;
        lat: number;
    };
    jobs: JobCard[];
};

const mapOptions = {
    style: 'mapbox://styles/mapbox/streets-v11',
};

const CustomMarker = ({ point, onClick }: { point: JobPoint; onClick: () => void }) => (
    <Marker latitude={point.coordinates.lat} longitude={point.coordinates.lng} offsetTop={20}>
        <div className="job-marker" onClick={onClick}>
            <span>
                <b>{point.jobs.length > 1 && point.jobs.length}</b>
            </span>
        </div>
    </Marker>
);

const JobsPopup = ({ point, onClose }: { point: JobPoint; onClose: () => void }) => (
    <Popup
        className="jobs-popup"
        latitude={point.coordinates.lat}
        longitude={point.coordinates.lng}
        closeButton
        offsetTop={45}
        closeOnClick={false}
        onClose={onClose}
    >
        <JobList jobs={point.jobs}></JobList>
    </Popup>
);

const JobList = ({ jobs }: { jobs: JobCard[] }) => {
    return (
        <div className="jobs-popup__job-list">
            {jobs.map((job) => (
                <JobListItem job={job} />
            ))}
        </div>
    );
};

const JobListItem = ({ job }: { job: JobCard }) => (
    <div className="jobs-popup__job-list__item">
        <div>{job.jobTitle}</div>
    </div>
);

export const Map = () => {
    const [viewport, setViewport] = useState({});

    const [points, setPoints] = useState<JobPoint[]>([]);

    const [selectedPoint, setSelectedPoint] = useState<JobPoint | null>(null);
    const resetPoint = useCallback(() => setSelectedPoint(null), []);

    useEffect(() => {
        const dbService = DbService.getInstance();
        dbService
            .connect({
                hostName: 'http://192.168.1.30',
                port: 1488,
            })
            .then(() => dbService.getDatabase('stack_jobs'))
            .then((db) => db?.getCollection<IRecord & JobCard>('job_cards'))
            .then((collection) => collection?.getAll())
            .then((items) => {
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
                <CustomMarker key={index} point={p} onClick={() => setSelectedPoint(p)} />
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
                {selectedPoint && <JobsPopup point={selectedPoint} onClose={resetPoint} />}
            </ReactMapGL>
        </div>
    );
};
