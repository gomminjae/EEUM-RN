const KOREAN_BLOCKED_TERMS = [
  '씨발',
  '시발',
  'ㅅㅂ',
  '병신',
  'ㅂㅅ',
  '개새끼',
  '좆',
  '존나',
  '꺼져',
];

const ENGLISH_BLOCKED_PATTERN =
  /(^|[^a-z])(fuck(?:er|ing)?|bitch(?:es)?|asshole|n[i1]gg(?:er|a)s?)([^a-z]|$)/i;

const normalizeKorean = (value: string) =>
  value.toLowerCase().replace(/[\s._*~`'"\-]+/g, '');

export function containsObjectionableContent(...values: string[]): boolean {
  return values.some((value) => {
    const normalized = normalizeKorean(value);
    return (
      KOREAN_BLOCKED_TERMS.some((term) => normalized.includes(term)) ||
      ENGLISH_BLOCKED_PATTERN.test(value)
    );
  });
}
