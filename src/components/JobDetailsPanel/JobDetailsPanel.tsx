import React from 'react';
import ReactDOM from 'react-dom';

import { IJobCard } from '@interfaces/index';

type JobDetailsPanelProps = {
    job: IJobCard;
};

const styles: React.CSSProperties = {
    position: 'absolute',
    height: '100vh',
    right: '0',
    top: 0,
    width: '30vw',
    backgroundColor: 'white',
    display: 'flex',
};

export const JobDetailsPanel = ({ job }: JobDetailsPanelProps) => {
    return ReactDOM.createPortal(
        <div style={styles}>
            <h2>{job.jobTitle}</h2>
        </div>,
        document.body
    );
};
