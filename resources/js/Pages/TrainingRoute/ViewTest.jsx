import Layout from "@/Layouts/index.jsx";
import {Button, Message, Panel, Text} from "rsuite";
import _ from "lodash";
import {Link} from "@inertiajs/react";

const ViewTest = props => {
    const {training_route} = props;
    const user = training_route.users[0];
    return (
        <Layout>
            <div className="flex items-center justify-center w-full h-full">
                <Panel bordered shaded className="p-4">
                    <div className='space-y-4 min-w-[500px]'>
                        <Text className="text-center" color={'blue'} weight={'bold'} size={'xxl'}>Bài thi đào tạo: {training_route.title}</Text>
                        <Text weight={'bold'}>Nhân viên làm đào tạo: {user.name}</Text>
                        <Text weight={'bold'}>Thời gian làm bài thi: {training_route.time} phút</Text>
                        <Text weight={'bold'}>Số câu hỏi: {training_route.test_questions_count} câu hỏi</Text>
                        <Text weight={'bold'}>Nghiệp vụ được phép xem: {training_route.workflows.length} nghiệp vụ</Text>
                        {training_route.workflows.length > 0 && (
                            <ul>
                                {training_route.workflows.map((workflow,key) => (
                                    <li key={key}>Nghiệp vụ: {workflow.title}</li>
                                ))}
                            </ul>
                        )}
                        <Text weight={'bold'}>Mô tả về đào tạo:</Text>
                        <div dangerouslySetInnerHTML={{__html: training_route.description}} />
                        <Message type={'warning'} showIcon={true}>
                            <b>Lưu ý:</b>
                            <ul>
                                <li>Khi làm bài thi sẽ bật full màn hình</li>
                                <li>Không được đổi tab hay thoát khỏi trình duyệt, nếu thoát sẽ tự động nộp bài</li>
                                <li>Hết giờ làm bài, hệ thống sẽ tự động nộp bài</li>
                            </ul>
                        </Message>
                        <Button block={true} appearance={'primary'} as={Link} href={route('training_route.do_test',{training_route_id: training_route.id,user_id: user.id})}>
                            Làm bài thi
                        </Button>
                    </div>
                </Panel>
            </div>
        </Layout>
    )

}
export default ViewTest
