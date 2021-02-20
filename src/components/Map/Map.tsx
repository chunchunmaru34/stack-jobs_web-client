import { useCallback, useEffect, useMemo, useState } from 'react';
import ReactMapGL from 'react-map-gl';
import { groupBy, prop, uniqBy, intersection, filter } from 'ramda';

import { IJobCard, IMapFilters, JobPoint } from '@interfaces/index';

import { useJobDetailsPanel } from 'components/JobDetailsPanel/JobDetailsPanelProvider';
import { Maybe } from '@models/Maybe';
import { Conditional } from 'components/Conditional';

import { JobMarker } from './JobMarker';
import { JobsPopup } from './JobsPopup';
import { MapFilters } from './MapFilters/MapFilters';
import { NoLocationItems } from './NoLocationItems/NoLocationItems';
import { useJobPoints } from 'hooks/useJobPoints';

const mapOptions = {
    style: 'mapbox://styles/mapbox/streets-v11',
};

export const Map = () => {
    const [viewport, setViewport] = useState({});
    const [selectedPoint, setSelectedPoint] = useState<JobPoint | null>(null);
    const [selectedPointCoords, setSelectedPoinCoords] = useState<{ x: number; y: number }>({
        x: 0,
        y: 0,
    });
    const [filters, setFilters] = useState<IMapFilters>({});

    const resetPoint = useCallback(() => setSelectedPoint(null), []);
    const { setSelectedJob } = useJobDetailsPanel();
    const handleSelectJob = useCallback((job?: IJobCard) => setSelectedJob(Maybe.of(job)), []);
    const handleApplyFilters = useCallback((filters: IMapFilters) => {
        resetPoint();
        setFilters({
            technologies: filters.technologies?.length ? filters.technologies : undefined,
        });
    }, []);

    const { points, noLocationFoundItems } = useJobPoints();

    const markers = useMemo(() => {
        const filterdPoints = points.reduce((acc, item) => {
            if (!filters.technologies?.length) {
                return [...acc, item];
            }

            const items = item.jobs.filter(
                (job) => !!intersection(job.technologies, filters.technologies!).length
            );

            if (items.length) {
                return [...acc, { ...item, jobs: items }];
            }

            return acc;
        }, [] as JobPoint[]);

        return filterdPoints.map((p, index) => (
            <JobMarker
                key={`${p.coordinates.lat}-${p.coordinates.lng}`}
                point={p}
                onClick={(e) => {
                    setSelectedPoinCoords({ x: e.clientX, y: e.clientY });
                    setSelectedPoint(p);
                }}
            />
        ));
    }, [points, filters]);

    const filteredNoLocationItems = useMemo(
        () =>
            Object.keys(noLocationFoundItems).reduce((acc, locKey) => {
                if (!filters.technologies?.length) {
                    return { ...acc, [locKey]: noLocationFoundItems[locKey] };
                }

                const filteredJobs = noLocationFoundItems[locKey].filter(
                    (item) => !!intersection(item.technologies, filters.technologies!).length
                );
                if (!filteredJobs.length) {
                    return acc;
                }

                return { ...acc, [locKey]: filteredJobs };
            }, {}),
        [noLocationFoundItems, filters]
    );

    return (
        <div style={{ display: 'flex', height: '100vh', width: '100vw' }}>
            <MapFilters filters={filters} data={points} onChange={handleApplyFilters} />
            <Conditional showIf={!!Object.keys(filteredNoLocationItems).length}>
                <NoLocationItems data={filteredNoLocationItems} />
            </Conditional>
            <ReactMapGL
                mapboxApiAccessToken={process.env.MAPBOX_TOKEN}
                width="100%"
                height="100%"
                {...viewport}
                mapOptions={mapOptions}
                onViewportChange={setViewport}
                onViewStateChange={resetPoint}
            >
                {markers}
                {selectedPoint && (
                    <JobsPopup
                        position={selectedPointCoords}
                        point={selectedPoint}
                        onJobSelect={handleSelectJob}
                        onClose={resetPoint}
                    />
                )}
            </ReactMapGL>
        </div>
    );
};
