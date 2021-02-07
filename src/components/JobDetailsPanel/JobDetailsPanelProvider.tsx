import React, { useCallback, useContext, useMemo, useState } from 'react';

import { IJobCard } from '@interfaces/index';

import { JobDetailsPanel } from './JobDetailsPanel';
import { Conditional } from 'components/Conditional';

type JobDetailsPanelContextValue = {
    selectedJob?: IJobCard;
    setSelectedJob: (job: IJobCard) => void;
};

export const JobDetailsPanelContext = React.createContext<JobDetailsPanelContextValue>({
    setSelectedJob: () => {},
});
export const useJobDetailsPanel = () => useContext(JobDetailsPanelContext);

export const JobDetailsPanelContextProvider = ({ children }: { children: React.ReactNode }) => {
    const [selectedJob, setSelectedJob] = useState<IJobCard>();

    const contextValue = useMemo(
        () => ({
            selectedJob,
            setSelectedJob,
        }),
        []
    );

    return (
        <JobDetailsPanelContext.Provider value={contextValue}>
            {children}
            {selectedJob && <JobDetailsPanel job={selectedJob}></JobDetailsPanel>}
        </JobDetailsPanelContext.Provider>
    );
};
