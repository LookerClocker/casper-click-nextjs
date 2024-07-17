import { useQuery } from 'react-query';
import { getAllValidators } from '../services/httpReq';
import { ValidatorsPayload } from '../types/validators';

export const useGetAllValidators = (eraId: any) =>
  useQuery<ValidatorsPayload, Error>('allValidators', () => getAllValidators(eraId), {
    enabled: Boolean(eraId)
  });
