import { TPosts, TPostStatus, TPostType } from "src/types"
import { filterPostsCore } from "./filterPostsCore"

export type FilterPostsOptions = {
  acceptStatus?: TPostStatus[]
  acceptType?: TPostType[]
}

const initialOption: FilterPostsOptions = {
  acceptStatus: ["Public"],
  acceptType: ["Post"],
}
export function filterPosts(
  posts: TPosts,
  options: FilterPostsOptions = initialOption
) {
  return filterPostsCore(posts, options)
}
