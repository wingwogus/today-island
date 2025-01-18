import usePostsQuery from "./usePostsQuery"
import {getAllSelectItemsCountFromPosts, getAllSelectItemsFromPosts} from "src/libs/utils/notion"

export const useTagsQuery = () => {
  const posts = usePostsQuery()
  const tags = getAllSelectItemsFromPosts("tags", posts)
  const tagCount    = getAllSelectItemsCountFromPosts("tags", posts)

  return [tags, tagCount]
}
