export const convertBigIntToString = (data) => {
  if (Array.isArray(data)) {
    return data.map(convertBigIntToString);
  } else if (data && typeof data === "object") {
    return Object.fromEntries(
      Object.entries(data).map(([key, value]) => [
        key,
        typeof value === "bigint" ? value.toString() : value
      ])
    );
  }
  return data;
};
export const calReturnIndex = (index, length) => {
  if (index === undefined) throw new Error("찾을 수 없습니다.");

  // 결과를 5개로 제한
  const start = Math.max(0, index - 2); // 시작 인덱스
  const end = Math.min(index + 3, length); // 끝 인덱스

  // 데이터의 길이에 따라 조정
  if (end - start < 5) {
    // 데이터가 5개 미만인 경우
    if (start === 0) {
      return [start, Math.min(5, length)]; // 0부터 시작
    } else {
      return [Math.max(0, length - 5), length]; // 마지막 5개를 반환
    }
  }

  return [start, end];
};
