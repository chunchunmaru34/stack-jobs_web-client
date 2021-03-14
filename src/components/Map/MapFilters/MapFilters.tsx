import { Badge, Fab, makeStyles } from '@material-ui/core';
import React, { useCallback, useMemo } from 'react';

import { IMapFilters, JobPoint } from '@interfaces/index';
import { useToggle } from 'hooks/useToggle';
import { countTruthyKeys } from 'utils/objects';
import { uniqByUsageCount } from 'utils/arrays';

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
    onClear: () => void;
};

export const MapFilters = ({ filters, data, onChange, onClear }: MapFiltersProps) => {
    const [isOpen, toggleOpen, { setOff: closePopup }] = useToggle(false);
    const styles = useStyles();

    const options = useMemo(() => {
        const jobs = Object.values(data).flatMap((x) => x.jobs);

        const technologies = uniqByUsageCount(jobs.flatMap((j) => j.technologies));

        return { technologies };
    }, [data]);

    const appliedFiltersCount = useMemo(() => countTruthyKeys(filters), [filters]);

    const handleApply = useCallback(
        (data) => {
            closePopup();
            onChange(data);
        },
        [onChange, closePopup]
    );

    const handleReset = useCallback(() => onClear(), [onChange]);

    return (
        <>
            <Fab
                variant="extended"
                className={`map-filters ${styles.container}`}
                onClick={toggleOpen}
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
                    onClose={closePopup}
                    onReset={handleReset}
                />
            )}
        </>
    );
};
