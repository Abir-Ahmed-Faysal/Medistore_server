export type IOptions = {
  search?: string
  category?: string
  minPrice?: string
  maxPrice?: string
  manufacturer?: string
  page?: string
}




export const PaginationHelperFunction = (option: IOptions) => {
  const page = Math.max(Number(option.page) || 1, 1)
  const limit = 15
  const skip = (page - 1) * limit

  return {
    ...(typeof option.search === "string" && option.search.trim()
      ? { search: option.search.trim() }
      : {}),

    ...(typeof option.category === "string" && option.category.trim()
      ? { category: option.category.trim() }
      : {}),

    ...(typeof option.manufacturer === "string" &&
    option.manufacturer.trim()
      ? { manufacturer: option.manufacturer.trim() }
      : {}),

    ...(option.minPrice !== undefined && !isNaN(Number(option.minPrice))
      ? { minPrice: Number(option.minPrice) }
      : {}),

    ...(option.maxPrice !== undefined && !isNaN(Number(option.maxPrice))
      ? { maxPrice: Number(option.maxPrice) }
      : {}),

    page,
    skip,
    limit,
  }
}
