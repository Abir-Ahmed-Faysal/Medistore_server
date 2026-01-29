export type IOutputOptions = {
    search: string|undefined,
    category: string|undefined,
    minPrice: number,
    maxPrice: number;
    manufacturer: string|undefined;
    page: number;
    skip: number;
    limit:number
}