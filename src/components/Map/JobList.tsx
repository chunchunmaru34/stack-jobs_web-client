import { IJobCard } from '@interfaces/index';

import { JobListItem } from './JobListItem';

export const JobList = ({
    jobs,
    onSelectItem,
}: {
    jobs: IJobCard[];
    onSelectItem: (job: IJobCard) => void;
}) => {
    return (
        <div className="jobs-popup__job-list">
            {jobs.map((job) => (
                <JobListItem key={job.jobId} job={job} onClick={onSelectItem} />
            ))}
        </div>
    );
};
