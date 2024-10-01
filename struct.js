import * as s from "superstruct";

// 수정해서 사용
export const CreateExample = s.object({
  name: s.size(s.string(), 1, 10),
  description: s.string(),
  price: s.min(s.number(), 0),
});

export const PatchExample = s.partial(CreateExample);
