import { useMutation } from '@tanstack/react-query';
import { reportPost } from '../api/reportPost';

export function useReportPost() {
  return useMutation({ mutationFn: reportPost });
}
