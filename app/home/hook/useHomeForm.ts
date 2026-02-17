import { GetTop } from "./useHomeApi";


const HomeForm = () => {
    const {data, isFetching, isFetched, isError,} =  GetTop();

    return {
        data,
        isFetching,
        isFetched,
        isError
    }
}

export default HomeForm;