import React, { useCallback, useContext, useMemo, useState } from 'react';

import { IJobCard } from '@interfaces/index';
import { Maybe } from '@models/Maybe';

import { JobDetailsPanel } from './JobDetailsPanel';

type JobDetailsPanelContextValue = {
    selectedJob: Maybe<IJobCard>;
    setSelectedJob: (job: Maybe<IJobCard>) => void;
};

export const JobDetailsPanelContext = React.createContext<JobDetailsPanelContextValue>({
    selectedJob: Maybe.Nothing(),
    setSelectedJob: () => {},
});
export const useJobDetailsPanel = () => useContext(JobDetailsPanelContext);

export const JobDetailsPanelContextProvider = ({ children }: { children: React.ReactNode }) => {
    const [selectedJob, setSelectedJob] = useState<Maybe<IJobCard>>(Maybe.Nothing());

    const contextValue = useMemo(
        () => ({
            selectedJob,
            setSelectedJob,
        }),
        []
    );

    const resetSelectedJob = useCallback(() => setSelectedJob(Maybe.Nothing()), []);

    return (
        <JobDetailsPanelContext.Provider value={contextValue}>
            {children}
            {selectedJob.isJust && (
                <JobDetailsPanel job={selectedJob.getValue()!} onClose={resetSelectedJob} />
            )}
        </JobDetailsPanelContext.Provider>
    );
};
