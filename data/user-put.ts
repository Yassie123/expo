import mutation from './_mutation';
import useSWRMutation from 'swr/mutation'
import { API_URL } from '@/constants/Api';
 
export default function useUserPut(id: string | string[]) {
  const userId = Array.isArray(id) ? id[0] : id;
  const { trigger, data, error, isMutating } = useSWRMutation(
    `${API_URL}/users/${userId}`,
    (url, { arg }: { arg: { username: string } }) =>
      mutation(url, { method: 'PUT', body: arg })
  );

  return { data, isMutating, trigger, isError: error };
}
