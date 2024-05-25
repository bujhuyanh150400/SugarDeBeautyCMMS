import {router} from "@inertiajs/react";
import {useState} from "react";
import {Loader} from "rsuite";
import {useDispatch, useSelector} from "react-redux";
import {setLoading} from "@/redux/reducers/AppSlice.js";


const Loading = () => {
    const dispatch = useDispatch();
    const loading = useSelector(state => state.app.loading);
    router.on('start', () => {
       dispatch(setLoading(true));
    })
    router.on('finish', (event) => {
        dispatch(setLoading(false));
    })
    return (
        <>
            {loading && (<div className="fixed w-screen h-screen z-[9999999999]">
                <Loader size="md" speed="slow"  backdrop content="Chờ 1 chút nhá" center />
            </div>)}
        </>
    )
}

export default Loading
