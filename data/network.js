import fetcher from './_fetcher';
import useSWR from 'swr'

export default function useNetwork () {
  const { data, error, isLoading } = useSWR(`https://orka-autowas.onrender.com/api/messages`, fetcher)
 
  return {
    network: data,
    isLoading,
    isError: error
  }
}