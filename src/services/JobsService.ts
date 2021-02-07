import axios from 'axios';

import { IJobCard } from '@interfaces/index';

const serverUrl = 'http://localhost:1488/api/v1';

export async function getJobs() {
    return axios.get(`${serverUrl}/jobs`).then((res) => res.data as IJobCard[]);
}
