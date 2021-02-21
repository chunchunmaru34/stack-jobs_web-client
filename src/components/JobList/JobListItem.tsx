import React from 'react';

import { IJobCard } from '@interfaces/index';
import { Conditional } from '@components/Conditional';

import './JobListItem.css';

const styles: { [key: string]: React.CSSProperties } = {
    container: {
        display: 'flex',
        flexWrap: 'nowrap',
    },
    image: {
        height: '3em',
    },
    imageContainer: {
        width: '3em',
        marginRight: '0.5em',
        overflow: 'hidden',
    },
    technology: {
        backgroundColor: 'cadetblue',
        borderRadius: '3px',
        padding: '0.25em',
        marginRight: '0.5em',
        color: 'white',
    },
    technologies: {
        display: 'flex',
    },
    details: {
        flex: 1,
    },
};

export const JobListItem = ({
    job,
    onClick,
}: {
    job: IJobCard;
    onClick: (job: IJobCard) => void;
}) => (
    <div className="job-list__item" style={styles.container} onClick={() => onClick(job)}>
        <div style={styles.imageContainer}>
            <img style={styles.image} src={job.imageUrl}></img>
        </div>
        <div style={styles.details} className="job-list__details">
            <div style={styles.jobTitle}>
                <h3>{job.jobTitle}</h3>
            </div>
            <div>{job.companyName}</div>
            <div style={styles.technologies}>
                {job.technologies.map((t) => (
                    <div key={t} style={styles.technology}>
                        {t}
                    </div>
                ))}
            </div>
            <div className="job-list__item__perks">
                <Conditional showIf={!!job.salary}>
                    <span>{job.salary}</span>
                </Conditional>
                <Conditional showIf={!!job.isEquityIncluded}>
                    <span>Equity</span>
                </Conditional>
                <Conditional showIf={!!job.remote}>
                    <span>{job.remote}</span>
                </Conditional>
                <Conditional showIf={!!job.isVisaSponsored}>
                    <span>Visa Sponsored</span>
                </Conditional>
                <Conditional showIf={!!job.isPaidRelocation}>
                    <span>Paid Relocation</span>
                </Conditional>
            </div>
        </div>
    </div>
);
