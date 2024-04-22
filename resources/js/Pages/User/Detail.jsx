import LayoutCMMS from "@/Layouts/index.jsx";
import {Avatar, Col, Flex, Row, Typography} from "antd";
import { UserOutlined} from "@ant-design/icons";

const Detail = (props) => {
    const user = props.user;
    console.log(props.user)
    return (
        <LayoutCMMS>
            <Row wrap={true}>
                <Col span={8}>
                    <Flex vertical align="center" gap={8} justify="center">
                        {(user.avatar) ?
                            <Avatar
                                size={150}
                                src={<img src={route('file.show', {filepath: user.avatar})} alt="avatar user"/>}/>
                            : <Avatar size={150}  icon={<UserOutlined/>}/>
                        }
                        <Typography.Title level={4} style={{margin:0}}>{user.name}</Typography.Title>
                        <Typography.Text italic >{props.auth.permission[user.permission].text}</Typography.Text>
                    </Flex>
                </Col>
                <Col span={16}>
                    test
                </Col>
            </Row>
        </LayoutCMMS>
    )
}
export default Detail
