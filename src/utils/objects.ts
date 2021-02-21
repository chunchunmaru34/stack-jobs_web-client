import { values, pipe } from 'ramda';

import { countTruthy } from './arrays';

export const countTruthyKeys = pipe<object, Array<any>, number>(values, countTruthy);
