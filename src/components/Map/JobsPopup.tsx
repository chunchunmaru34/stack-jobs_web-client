import { Popup } from 'react-map-gl';

import { IJobCard, JobPoint } from '@interfaces/index';

import { JobList } from './JobList';

type JobsPopupType = {
    point: JobPoint;
    onClose: () => void;
    onJobSelect: (job: IJobCard) => void;
};
export const JobsPopup = ({ point, onClose, onJobSelect }: JobsPopupType) => (
    <Popup
        className="jobs-popup"
        latitude={point.coordinates.lat}
        longitude={point.coordinates.lng}
        closeButton
        offsetTop={45}
        closeOnClick={false}
        onClose={onClose}
    >
        <JobList jobs={point.jobs} onSelectItem={onJobSelect}></JobList>
    </Popup>
);
