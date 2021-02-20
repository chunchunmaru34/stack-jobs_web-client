import { Badge, Fab, makeStyles } from '@material-ui/core';
import React, { useCallback, useMemo, useState } from 'react';
import * as R from 'ramda';

import { IMapFilters, JobPoint } from '@interfaces/index';
import { FiltersPopup } from './MapFiltersPopup';

const useStyles = makeStyles({
    container: {
        position: 'absolute',
        zIndex: 2,
        top: '1em',
        left: '1em',
        backgroundColor: 'white',
    },
});

type MapFiltersProps = {
    filters: IMapFilters;
    data: JobPoint[];
    onChange: (filters: IMapFilters) => void;
};

type TechUsageDictionary = { [key: string]: number };
const toUsageStat = (acc: TechUsageDictionary, item: string): TechUsageDictionary => ({
    ...acc,
    [item]: acc[item] ? acc[item] + 1 : 1,
});

// @ts-ignore
const sortByPopularity = R.compose(
    R.flatten,
    R.map((val: [string, number]) => val[0]),
    R.sort((a, b) => b[1] - a[1]),
    Object.entries,
    R.reduce(toUsageStat, {})
);

export const MapFilters = ({ filters, data, onChange }: MapFiltersProps) => {
    const [isOpen, setIsOpen] = useState<boolean>(false);
    const styles = useStyles();

    const options = useMemo(() => {
        const locations = Object.keys(data);
        const jobs = Object.values(data).flatMap((x) => x.jobs);

        const technologies = sortByPopularity(jobs.flatMap((j) => j.technologies));

        return { locations, technologies };
    }, [data]);

    const appliedFiltersCount = useMemo(
        () => Object.values(filters).reduce((acc, item) => (item ? acc + 1 : acc), 0),
        [filters]
    );

    const handleApply = useCallback(
        (data) => {
            setIsOpen(false);
            onChange(data);
        },
        [onChange]
    );

    return (
        <>
            <Fab
                variant="extended"
                className={`map-filters ${styles.container}`}
                onClick={() => setIsOpen(true)}
            >
                <Badge badgeContent={appliedFiltersCount} color="primary">
                    Filters
                </Badge>
            </Fab>
            {isOpen && (
                <FiltersPopup
                    filters={filters}
                    options={options}
                    onApply={handleApply}
                    onClose={() => setIsOpen(false)}
                />
            )}
        </>
    );
};
