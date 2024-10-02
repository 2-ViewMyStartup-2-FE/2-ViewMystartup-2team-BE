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
export const convertInvestmentsToString = (investments) => {
  return investments.map((investment) => ({
    ...convertBigIntToString(investment), // 기존 변환 함수 사용
    amount: investment.amount.toString() // 추가적인 변환 로직
  }));
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
export const compareValues = (a, b, order) => {
  const totalA = BigInt(a.virtualInvestment) + BigInt(a.actualInvestment);
  const totalB = BigInt(b.virtualInvestment) + BigInt(b.actualInvestment);
  if (order === "investmentHighest")
    if (totalB > totalA) return 1;
    else if (totalB < totalA) return -1;
    else return 0;
  else if (order === "investmentLowest")
    if (totalA > totalB) return 1;
    else if (totalA < totalB) return -1;
    else return 0;
  else if (order === "revenueHighest")
    if (BigInt(b.revenue) > BigInt(a.revenue)) return 1;
    else if (BigInt(b.revenue) < BigInt(a.revenue)) return -1;
    else return 0;
  else if (order === "revenueLowest")
    if (BigInt(a.revenue) > BigInt(b.revenue)) return 1;
    else if (BigInt(a.revenue) < BigInt(b.revenue)) return -1;
    else return 0;
  else if (order === "employeeHighest") return b.employee - a.employee;
  else if (order === "employeeLowest") return a.employee - b.employee;
  else if (totalB > totalA) return 1;
  else if (totalB < totalA) return -1;
  else return 0;
};
