import * as s from "superstruct";

// CreateInvestment 구조체 정의
export const CreateInvestment = s.object({
  investorName: s.size(s.string(), 2, 10),
  amount: s.size(s.integer(), 1, 10000),
  comment: s.size(s.string(), 10, 30),
  password: s.size(s.string(), 8, 15)
});
