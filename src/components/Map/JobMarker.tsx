import { Marker } from 'react-map-gl';

import { JobPoint } from '@interfaces/index';

export const JobMarker = ({ point, onClick }: { point: JobPoint; onClick: () => void }) => (
    <Marker latitude={point.coordinates.lat} longitude={point.coordinates.lng} offsetTop={20}>
        <div className="job-marker" onClick={onClick}>
            <span>
                <b>{point.jobs.length > 1 && point.jobs.length}</b>
            </span>
        </div>
    </Marker>
);
