import { useMemo } from 'react';
import { makeStyles, Typography } from '@material-ui/core';

import { IJobCard, JobPoint } from '@interfaces/index';
import { JobList } from '@components/JobList/JobList';
import { Popup } from '@components/Popup/Popup';

type JobsPopupType = {
    point: JobPoint;
    position: { x: number; y: number };
    onClose: () => void;
    onJobSelect: (job: IJobCard) => void;
};

const useStyles = makeStyles({
    content: {
        overflowY: 'auto',
    },
});

export const JobsPopup = ({ position, point, onClose, onJobSelect }: JobsPopupType) => {
    const positionStyle = useMemo(
        () => ({
            top: `${position.y}px`,
            left: `${position.x}px`,
        }),
        [position]
    );
    const classes = useStyles();

    return (
        <Popup className="jobs-popup" position={positionStyle} onClose={onClose}>
            <Popup.Header>
                <Typography variant="h5">{point.jobs[0].companyLocation}</Typography>
            </Popup.Header>
            <Popup.Content className={classes.content}>
                <JobList
                    className="jobs-popup__job-list"
                    jobs={point.jobs}
                    onSelectItem={onJobSelect}
                />
            </Popup.Content>
        </Popup>
    );
};
