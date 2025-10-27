import { useState } from 'react';
import mutation from './_mutation';

const useRegister = () => {
  const [isLoading, setIsLoading] = useState(false);

  const trigger = async (data: { email: string; password: string; username: string }) => {
    setIsLoading(true);
    try {
      const res = await mutation('/register', {
        method: 'POST',
        body: data,
      });
      setIsLoading(false);
      return res; // should return the new user and possibly a token
    } catch (err) {
      setIsLoading(false);
      throw err;
    }
  };

  return { trigger, isLoading };
};

export default useRegister;
