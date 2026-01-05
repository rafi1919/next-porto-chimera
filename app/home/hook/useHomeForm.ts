import { getTop } from "./useHomeApi";


const HomeForm = () => {
    const {data, isLoading, isError, refetch} =  getTop();

    return {
        data,
        isLoading,
        isError
    }
}

export default HomeForm;