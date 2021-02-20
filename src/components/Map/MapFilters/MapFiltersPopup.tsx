import React, { useState, useCallback } from 'react';
import { Button, makeStyles, Typography } from '@material-ui/core';
import { curry } from 'ramda';

import { IMapFilters } from '@interfaces/index';
import { Popup } from '../../Popup/Popup';

import { TechSelect } from './Controls';

type PopupProps = {
    filters: IMapFilters;
    options: { locations: string[]; technologies: string[] };
    onClose: () => void;
    onApply: (filters: IMapFilters) => void;
};

const popupPosition = {
    left: '1em',
    top: '5em',
};

const useStylesPopup = makeStyles({
    footer: {
        justifyContent: 'flex-end',
    },
});

export const FiltersPopup = ({ filters: filtersOuter, options, onClose, onApply }: PopupProps) => {
    const [filters, setFilters] = useState<IMapFilters>(filtersOuter);

    const styles = useStylesPopup();

    const handleChange = useCallback(
        curry((filterName: keyof IMapFilters, filterValue: IMapFilters[typeof filterName]) => {
            setFilters((f) => ({ ...f, [filterName]: filterValue }));
        }),
        []
    );

    const handleApply = () => onApply(filters);

    return (
        <Popup className={`map-filters-popup`} position={popupPosition} onClose={onClose}>
            <Popup.Header>
                <Typography variant="caption">Set job filters</Typography>
            </Popup.Header>
            <Popup.Content>
                <TechSelect
                    value={filters.technologies}
                    options={options.technologies}
                    onChange={handleChange('technologies')}
                />
            </Popup.Content>
            <Popup.Footer className={styles.footer}>
                <Button color="primary" onClick={handleApply}>
                    Apply
                </Button>
            </Popup.Footer>
        </Popup>
    );
};
