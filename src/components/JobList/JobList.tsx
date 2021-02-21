import React from 'react';
import { Divider } from '@material-ui/core';

import { IJobCard } from '@interfaces/index';

import { JobListItem } from './JobListItem';

export const JobList = ({
    className,
    jobs,
    onSelectItem,
}: {
    className: string;
    jobs: IJobCard[];
    onSelectItem: (job: IJobCard) => void;
}) => {
    return (
        <div className={className}>
            {jobs.map((job, index, arr) => (
                <React.Fragment key={job.jobId}>
                    <JobListItem job={job} onClick={onSelectItem} />
                    {index !== arr.length - 1 && <Divider />}
                </React.Fragment>
            ))}
        </div>
    );
};
