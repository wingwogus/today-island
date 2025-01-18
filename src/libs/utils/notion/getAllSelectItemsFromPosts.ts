import { TPosts } from "src/types"

export function getAllSelectItemsFromPosts(
  key: "tags" | "category",
  posts: TPosts
) {
  const selectedPosts = posts.filter((post) => post?.[key])
  const items = [...selectedPosts.map((p) => p[key]).flat()]
  const itemObj: { [itemName: string]: number } = {}
  items.forEach((item) => {
    if (!item) return
    if (item in itemObj) {
      itemObj[item]++
    } else {
      itemObj[item] = 1
    }
  })
  return itemObj
}

export function getAllSelectItemsCountFromPosts(
    key: "tags" | "category",
    posts: TPosts
) {
  const selectedPosts = posts.filter((post) => post?.[key]);
  const items = [...selectedPosts.map((p) => p[key]).flat()];
  const itemObj: { [itemName: string]: string[] } = {};
  items.forEach((item, index) => {
    if (!item) return;
    if (itemObj[item]) {
      itemObj[item].push(`post-${index + 1}`); // 게시글 ID는 예시로 index로 표기
    } else {
      itemObj[item] = [`post-${index + 1}`];
    }
  });
  const itemCount: { [itemName: string]: number } = {};
  Object.keys(itemObj).forEach((item) => {
    itemCount[item] = itemObj[item].length;
  });
  return itemCount;
}
