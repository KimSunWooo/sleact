import React, { Dispatch, SetStateAction, useCallback, useState } from 'react';

const useInput = <T = string>(
  initialValue: T,
): [T, (e: React.ChangeEvent<HTMLInputElement>) => void, Dispatch<SetStateAction<T>>] => {
  const [value, setValue] = useState(initialValue);
  const changeValue = useCallback((e) => {
    setValue(e.target.value);
  }, []);

  return [value, changeValue, setValue];
};

export default useInput;
