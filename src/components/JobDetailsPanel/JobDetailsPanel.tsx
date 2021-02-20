import React from 'react';
import ReactDOM from 'react-dom';
import { Button, Link, Typography } from '@material-ui/core';

import { IJobCard } from '@interfaces/index';

type JobDetailsPanelProps = {
    job: IJobCard;
    onClose: () => void;
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

export const JobDetailsPanel = ({ job, onClose }: JobDetailsPanelProps) => {
    return ReactDOM.createPortal(
        <div style={styles}>
            <Typography variant="h2" component="h2">
                <Link href={job.detailUrl} target="_blank">
                    {job.jobTitle}
                </Link>
            </Typography>
            <Button onClick={onClose}>Close</Button>
        </div>,
        document.body
    );
};
