import { useApplicationStore, useApplicationDispatch } from "../store/application/useApplicationStore";

export const useApplication = () => {

    const { page } = useApplicationStore()

    const dispatch = useApplicationDispatch()



}