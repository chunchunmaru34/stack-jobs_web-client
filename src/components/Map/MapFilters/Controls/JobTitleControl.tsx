import { TextField, makeStyles } from '@material-ui/core';

type JobTitleControlProps = {
    value?: string;
    className?: string;
    onChange: (value: string) => void;
};

const useStyles = makeStyles({
    input: {
        width: '100%',
    },
});

export const JobTitleControl = ({ value = '', className = '', onChange }: JobTitleControlProps) => {
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => onChange(e.target.value);

    const classes = useStyles();

    return (
        <TextField
            id="job-title-filter"
            label="Job Title"
            variant="outlined"
            className={`${classes.input} ${className}`}
            value={value}
            onChange={handleChange}
        />
    );
};
