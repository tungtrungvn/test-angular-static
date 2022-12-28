interface ISearch {
    searchFields: string[];
    searchValues: string[];
}

const transform = (
    searchFields: string[],
    searchValues: string[],
    searchField: string,
    searchValue: string,
): ISearch => {
    const filterIndex = searchFields.findIndex(field => field === searchField);
    if (filterIndex >= 0) {
        if (searchValue === '') {
            searchFields.splice(filterIndex, 1);
            searchValues.splice(filterIndex, 1);
        } else {
            searchValues[filterIndex] = searchValue;
        }
    } else if (filterIndex < 0 && searchValue !== null) {
        searchFields.push(searchField);
        searchValues.push(searchValue);
    }
    return {
        searchFields,
        searchValues
    };
};

export const SearchUtil = {
    transform
};
