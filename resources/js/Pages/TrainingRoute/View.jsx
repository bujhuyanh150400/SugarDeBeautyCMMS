import Layout from "@/Layouts/index.jsx";
import {Input, List, Text} from "rsuite";
import dayjs from "dayjs";


const View = props => {
    const {training_route} = props;
    console.log(training_route)
    return (
        <Layout>


            <Text weight={'bold'} size={'xxl'} className="!mb-4">Bảng điểm</Text>
            <List className="col-span-3">
                {training_route.users.map((user) => {
                    return (
                        <List.Item key={user.id} className="grid grid-cols-6 gap-4">
                            <Text color={'blue'} className="self-center">Tên: {user.name}</Text>
                            <Text className="self-center">Cơ sở: {user.facility.name}</Text>
                            <Text className="self-center">Chuyên ngành: {user.specialties.name}</Text>
                            <Text color={'green'} className="self-center">{user.pivot.score !== null ? `${user.pivot.score} Điểm` : `Chưa làm bài`} </Text>
                            <Text color={'green'} className="self-center">Bắt đầu: {user.pivot.time_start !== null ? dayjs(user.pivot.time_start).format('YYYY-MM-DD HH:mm:ss') : `Chưa làm bài`} </Text>
                            <Text color={'green'} className="self-center">Kết thúc: {user.pivot.time_did !== null ? dayjs(user.pivot.time_did).format('YYYY-MM-DD HH:mm:ss') : `Chưa làm bài`} </Text>
                        </List.Item>
                    )
                })}
            </List>
        </Layout>
    )
}
export default View;
