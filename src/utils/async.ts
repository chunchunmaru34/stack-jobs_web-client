import { Maybe } from '@models/Maybe';

// if error does not matter
export function wrapWithMaybe<T>(task: () => Promise<T>) {
    return async () => {
        try {
            const result = await task();
            if (!!result) {
                return Maybe.Just(result as NonNullable<T>);
            } else {
                return Maybe.Nothing<T>();
            }
        } catch (error) {
            return Maybe.Nothing<T>();
        }
    };
}
