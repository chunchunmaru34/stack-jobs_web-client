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
});

export const TechSelect = ({
    value = [],
    options,
    onChange,
}: {
    value?: string[];
    options: string[];
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
            id="combo-box-demo"
            multiple
            value={value}
            options={options}
            getOptionLabel={(option) => option}
            style={{ width: 300, marginTop: '1em' }}
            renderInput={(params) => (
                <TextField {...params} label="Technologies" variant="outlined" />
            )}
            onChange={handleChange}
        />
    );
};
