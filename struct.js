import * as s from "superstruct";

function validateBigIntAmount(value) {
  if (value < BigInt(100000000)) return false;
  if (value >= BigInt(1000000000000)) return false;
  return true;
}
// CreateInvestment 구조체 정의
export const CreateInvestment = s.object({
  investorName: s.size(s.string(), 2, 10),
  amount: s.refine(s.bigint(), "validateBigIntAmont", validateBigIntAmount),
  comment: s.size(s.string(), 10, 30),
  password: s.size(s.string(), 8, 15),
});

export const PatchInvestment = s.partial(CreateInvestment);
