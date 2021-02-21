import { useCallback, useMemo, useState } from 'react';
import ReactMapGL from 'react-map-gl';

import { IJobCard, IMapFilters, JobPoint } from '@interfaces/index';

import { useJobDetailsPanel } from '@components/JobDetailsPanel/JobDetailsPanelProvider';
import { Conditional } from '@components/Conditional';
import { Maybe } from '@models/Maybe';
import { useJobPoints } from '@hooks/useJobPoints';
import { useJobFilters } from '@hooks/useJobFilters';

import { JobMarker } from './JobMarker';
import { JobsPopup } from './JobsPopup';
import { MapFilters } from './MapFilters';
import { NoLocationItems } from './NoLocationItems';
import { filterJobPoints, filterNoLocationItems } from './utils';

const mapOptions = {
    style: 'mapbox://styles/mapbox/streets-v11',
};

export const Map = () => {
    const [viewport, setViewport] = useState({});
    const [selectedPoint, setSelectedPoint] = useState<Maybe<JobPoint>>(Maybe.Nothing());
    const [selectedPointCoords, setSelectedPoinCoords] = useState<{ x: number; y: number }>({
        x: 0,
        y: 0,
    });

    const { points, noLocationFoundItems } = useJobPoints();
    const { filters, setFilters, clearFilters, matchList } = useJobFilters();

    const resetPoint = useCallback(() => setSelectedPoint(Maybe.Nothing()), []);

    const { setSelectedJob } = useJobDetailsPanel();
    const handleSelectJob = useCallback((job?: IJobCard) => setSelectedJob(Maybe.of(job)), []);

    const handleApplyFilters = useCallback((filters: IMapFilters) => {
        resetPoint();
        setFilters(filters);
    }, []);

    const markers = useMemo(
        () =>
            filterJobPoints(matchList, points).map((p) => (
                <JobMarker
                    key={`${p.coordinates.lat}-${p.coordinates.lng}`}
                    point={p}
                    onClick={(e) => {
                        setSelectedPoinCoords({ x: e.clientX, y: e.clientY });
                        setSelectedPoint(Maybe.Just(p));
                    }}
                />
            )),
        [points, matchList]
    );

    const filteredNoLocationItems = useMemo(
        () => filterNoLocationItems(matchList, noLocationFoundItems),
        [noLocationFoundItems, matchList]
    );

    return (
        <div style={{ display: 'flex', height: '100vh', width: '100vw' }}>
            <MapFilters
                filters={filters}
                data={points}
                onChange={handleApplyFilters}
                onClear={clearFilters}
            />
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
                {selectedPoint.isJust && (
                    <JobsPopup
                        position={selectedPointCoords}
                        point={selectedPoint.getValue()!}
                        onJobSelect={handleSelectJob}
                        onClose={resetPoint}
                    />
                )}
            </ReactMapGL>
        </div>
    );
};
