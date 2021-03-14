import { useCallback, useMemo, useState } from 'react';
import ReactMapGL from 'react-map-gl';

import { IJobCard } from '@interfaces/index';

import { useJobDetailsPanel } from '@components/JobDetailsPanel/JobDetailsPanelProvider';
import { Conditional } from '@components/Conditional';
import { Maybe } from '@models/Maybe';

import { JobMarker } from './JobMarker';
import { JobsPopup } from './JobsPopup';
import { MapFilters } from './MapFilters';
import { NoLocationItems } from './NoLocationItems';
import { useMapData } from '@components/Map/useMapData';

const mapOptions = {
    style: 'mapbox://styles/mapbox/streets-v11',
};

export const Map = () => {
    const { jobPoints, filters, noLocationItems } = useMapData();

    const [viewport, setViewport] = useState({});
    const [selectedPointCoords, setSelectedPoinCoords] = useState<{ x: number; y: number }>({
        x: 0,
        y: 0,
    });

    const { setSelectedJob } = useJobDetailsPanel();
    const handleSelectJob = useCallback((job?: IJobCard) => setSelectedJob(Maybe.of(job)), []);

    const markers = useMemo(
        () =>
            jobPoints.items.map((p) => (
                <JobMarker
                    key={`${p.coordinates.lat}-${p.coordinates.lng}`}
                    point={p}
                    onClick={(e) => {
                        setSelectedPoinCoords({ x: e.clientX, y: e.clientY });
                        jobPoints.setSelectedPoint(Maybe.Just(p));
                    }}
                />
            )),
        [jobPoints]
    );

    return (
        <div style={{ display: 'flex', height: '100vh', width: '100vw' }}>
            <MapFilters
                filters={filters.items}
                data={jobPoints.items}
                onChange={filters.setFilters}
                onClear={filters.clearFilters}
            />
            <Conditional showIf={!!Object.keys(noLocationItems.items).length}>
                <NoLocationItems data={noLocationItems.items} />
            </Conditional>
            <ReactMapGL
                mapboxApiAccessToken={process.env.MAPBOX_TOKEN}
                width="100%"
                height="100%"
                {...viewport}
                mapOptions={mapOptions}
                onViewportChange={setViewport}
                onViewStateChange={jobPoints.resetPoint}
            >
                {markers}
                {jobPoints.selectedPoint.isJust && (
                    <JobsPopup
                        position={selectedPointCoords}
                        point={jobPoints.selectedPoint.getValue()!}
                        onJobSelect={handleSelectJob}
                        onClose={jobPoints.resetPoint}
                    />
                )}
            </ReactMapGL>
        </div>
    );
};
