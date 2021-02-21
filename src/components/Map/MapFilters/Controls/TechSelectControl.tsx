import { makeStyles, TextField } from '@material-ui/core';
import Autocomplete, { AutocompleteChangeReason } from '@material-ui/lab/Autocomplete';

const useStylesSelect = makeStyles({
    chips: {
        display: 'flex',
        flexWrap: 'wrap',
    },
    chip: {
        margin: 2,
    },
    input: {
        width: '100%',
    },
});

export const TechSelect = ({
    value = [],
    options,
    className = '',
    onChange,
}: {
    value?: string[];
    options: string[];
    className?: string;
    onChange: (value: string[]) => void;
}) => {
    const classes = useStylesSelect();

    const handleChange = (
        e: React.ChangeEvent<{}>,
        value: string[],
        reason: AutocompleteChangeReason
    ) => onChange(value);

    return (
        <Autocomplete
            id="tech-select-filter"
            className={`${classes.input} ${className}`}
            multiple
            value={value}
            options={options}
            getOptionLabel={(option) => option}
            renderInput={(params) => (
                <TextField {...params} label="Technologies" variant="outlined" />
            )}
            onChange={handleChange}
        />
    );
};
