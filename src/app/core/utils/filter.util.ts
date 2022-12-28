interface IFilter {
    filterFields: string[];
    filterValues: string[];
}

const transform = (
    filterFields: string[],
    filterValues: string[],
    filterName: string,
    filterValue: string,
): IFilter => {
    const filterIndex = filterFields.findIndex(field => field === filterName);
    if (filterIndex >= 0) {
        if(filterValue === '') {
            filterFields.splice(filterIndex, 1);
            filterValues.splice(filterIndex, 1);
        } else {
            filterValues[filterIndex] = filterValue;
        }
    } else {
        filterFields.push(filterName);
        filterValues.push(filterValue);
    }
    return {
        filterFields,
        filterValues
    };
};

export const FilterUtil = {
    transform
};
