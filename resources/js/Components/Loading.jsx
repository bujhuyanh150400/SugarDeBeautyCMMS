import {router} from "@inertiajs/react";
import {useState} from "react";
import {Loader} from "rsuite";


const Loading = () => {
    const [load,setLoad] = useState(false);
    router.on('start', () => {
        setLoad(true);
    })
    router.on('finish', (event) => {
        setLoad(false);
    })


    return (
        <>
            {load && (<div className="fixed w-screen h-screen z-[9999999999]">
                <Loader size="md" speed="slow"  backdrop content="Chờ 1 chút nhá" center />
            </div>)}
        </>
    )
}

export default Loading
