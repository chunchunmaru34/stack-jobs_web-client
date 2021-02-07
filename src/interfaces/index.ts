export interface IJobCard {
    jobId: number;
    jobTitle: string;
    detailUrl: string;
    companyName: string;
    companyLocation: string;
    imageUrl?: string;
    technologies: string[];
    salary?: string;
    remote?: string;
    isEquityIncluded: boolean;
    isVisaSponsored: boolean;
    isPaidRelocation: boolean;
}

export interface JobPoint {
    coordinates: {
        lng: number;
        lat: number;
    };
    jobs: IJobCard[];
}
