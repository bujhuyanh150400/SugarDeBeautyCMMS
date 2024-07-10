import Layout from "@/Layouts/index.jsx";
import {Text} from "rsuite";
const Dashboard = (props) => {
    const user = props.auth.user
    return (
        <Layout>
            <div className="flex flex-col items-center justify-center w-full h-full gap-2">
                <Text weight={'bold'} color={'blue'} size={'xxl'}>Chào bạn {user.name}</Text>
                <Text>Chào mừng bạn quay chở lại với Sugardebeaute</Text>
            </div>
        </Layout>
    )
}
export default Dashboard;
