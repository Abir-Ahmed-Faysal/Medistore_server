type IOptions = {
    search?: string,
    category?: string,
    minPrice?: string,
    maxPrice?: string;
    manufacturer?: string;
    page?: string;
}

type IOutputOptions = {
    search?: string|undefined,
    category?: string,
    minPrice?: number,
    maxPrice?: number;
    manufacturer?: string;
    page?: number;
    skip?: number
}

//!  /api/medicines?search=napa&category=painkiller&minPrice=50&maxPrice=200&manufacturer=Square


export const PaginationHelperFunction = (option: IOptions): IOutputOptions => {
    const search = option.search || undefined
    const category = option.category || ""
    const minPrice = Math.ceil(Number(option.minPrice) || 1)
    const maxPrice = Number(option.maxPrice) || 50
    const manufacturer = option.manufacturer || ""
    const page = Number(option.page) || 1




    const limit = 15

    const skip = (page - 1) * limit



    return {
        search,
        category,
        minPrice,
        maxPrice,
        manufacturer,
        page, skip
    }


};

