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
    coordinates: Coordinates;
    jobs: IJobCard[];
}

export interface IFunctor<T> {
    map<TResult>(fn: (val: T) => TResult): IFunctor<TResult | null | undefined>;
}

export interface IMapFilters {
    technologies?: string[];
}

export type LocationJobDict = { [key: string]: IJobCard[] };

export type Coordinates = {
    lng: number;
    lat: number;
};

export type CityCoordinatesMap = { [key: string]: Coordinates };
