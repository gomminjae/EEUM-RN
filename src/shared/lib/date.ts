/** ISO 문자열을 "YYYY.MM.DD"로 — Date 파싱 없이 안전하게 앞 10자리만 변환 */
export function formatDate(iso: string | null | undefined): string {
  if (!iso || iso.length < 10) return '';
  return iso.slice(0, 10).replace(/-/g, '.');
}
