import { useCallback, useState, useMemo } from 'react';
import { curry, filter } from 'ramda';

import { IMapFilters, IJobCard } from '@interfaces/index';

type Matcher = (job: IJobCard) => boolean;
const valid = () => true;

const matchTechnologies = curry((technologies: string[], item: IJobCard) =>
    technologies.every((tech) => item.technologies.includes(tech))
);

const matchTitle = curry((title: string, item: IJobCard) =>
    item.jobTitle.toLowerCase().includes(title.toLowerCase())
);

export const useJobFilters = () => {
    const [filters, setFilters] = useState<IMapFilters>({});

    const handleSetFilters = useCallback((filters: IMapFilters) => {
        setFilters({
            technologies: filters.technologies?.length ? filters.technologies : undefined,
            title: filters.title ? filters.title : undefined,
        });
    }, []);

    const handleClearFilters = useCallback(() => setFilters({}), []);

    const matchers: Matcher[] = useMemo(
        () => [
            filters.technologies?.length ? matchTechnologies(filters.technologies) : valid,
            filters.title ? matchTitle(filters.title) : valid,
        ],
        [filters]
    );

    const matchItem = useCallback(
        (item: IJobCard) => matchers.every((match) => match(item)),
        matchers
    );
    const matchList = useCallback(filter(matchItem), [matchItem]);

    return {
        filters,
        setFilters: handleSetFilters,
        clearFilters: handleClearFilters,
        matchList,
        matchItem,
    };
};
