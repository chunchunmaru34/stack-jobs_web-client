import React, { useState, useCallback } from 'react';
import { Button, makeStyles, Typography } from '@material-ui/core';
import { curry } from 'ramda';

import { IMapFilters } from '@interfaces/index';
import { Popup } from '../../Popup/Popup';

import { JobTitleControl, TechSelect } from './Controls';

type PopupProps = {
    filters: IMapFilters;
    options: { locations: string[]; technologies: string[] };
    onClose: () => void;
    onApply: (filters: IMapFilters) => void;
    onReset: () => void;
};

const popupPosition = {
    left: '1em',
    top: '5em',
};

const useStylesPopup = makeStyles({
    container: {
        width: '25em',
    },
    footer: {
        justifyContent: 'flex-end',
    },
    content: {
        '& > *': {
            marginTop: '1em',
        },
    },
});

export const FiltersPopup = ({
    filters: filtersOuter,
    options,
    onClose,
    onApply,
    onReset,
}: PopupProps) => {
    const [filters, setFilters] = useState<IMapFilters>(filtersOuter);
    const hasFilters = !!Object.keys(filters).length;

    const styles = useStylesPopup();

    const handleChange = useCallback(
        curry((filterName: keyof IMapFilters, filterValue: IMapFilters[typeof filterName]) => {
            setFilters((f) => ({ ...f, [filterName]: filterValue }));
        }),
        []
    );

    const handleReset = () => {
        setFilters({});
        onReset();
    };
    const handleApply = () => onApply(filters);

    return (
        <Popup
            className={`map-filters-popup ${styles.container}`}
            position={popupPosition}
            onClose={onClose}
        >
            <Popup.Header>
                <Typography variant="caption">Set job filters</Typography>
            </Popup.Header>
            <Popup.Content className={styles.content}>
                <JobTitleControl value={filters.title} onChange={handleChange('title')} />
                <TechSelect
                    value={filters.technologies}
                    options={options.technologies}
                    onChange={handleChange('technologies')}
                />
            </Popup.Content>
            <Popup.Footer className={styles.footer}>
                <Button color="secondary" disabled={!hasFilters} onClick={handleReset}>
                    Clear all
                </Button>
                <Button color="primary" onClick={handleApply}>
                    Apply
                </Button>
            </Popup.Footer>
        </Popup>
    );
};
