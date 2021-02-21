import { useCallback, useState } from 'react';

type ToggleCotrols = [boolean, () => void, { setOn: () => void; setOff: () => void }];

export const useToggle = (initialValue: boolean): ToggleCotrols => {
    const [value, setValue] = useState(initialValue);

    const toggle = useCallback(() => setValue((x) => !x), []);

    const setOn = useCallback(() => setValue(true), []);
    const setOff = useCallback(() => setValue(false), []);

    return [value, toggle, { setOn, setOff }];
};
