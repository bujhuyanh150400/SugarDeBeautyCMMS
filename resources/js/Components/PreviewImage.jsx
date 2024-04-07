import {useEffect, useState} from "react";
import {Button, Flex, Image, message, Upload} from "antd";
import {CloudUploadOutlined, DeleteOutlined} from "@ant-design/icons";


const PreviewImage = ({setFile}) => {
    const [imageUrl, setImageUrl] = useState(null);
    useEffect(() => {
        return () => {
            // Xóa URL của hình ảnh khi component unmount hoặc khi imageURL thay đổi
            if (imageUrl) {
                URL.revokeObjectURL(imageUrl);
            }
        };
    }, [imageUrl]);
    const beforeUpload = async (file) => {
        if (!(file.type === 'image/jpeg' || file.type === 'image/png')) {
            await message.error('Chỉ chấp nhận những đuổi file dạng PNG và JPG ');
            return false
        }
        if (!(file.size / 1024 / 1024 < 15)) {
            await message.error('Ảnh phải nhỏ hơn 15MB!');
            return false
        }
        setImageUrl(URL.createObjectURL(file));
        if (setFile && typeof setFile === 'function'){
            setFile(file);
        }
        return false
    };
    const handleCancelFile= () => {
        setImageUrl(null);
        URL.revokeObjectURL(imageUrl);
        if (setFile && typeof setFile === 'function'){
            setFile(null);
        }
    }
    return (
        <>
            <Flex vertical={true} gap={16}>
                {
                    imageUrl ? (
                        <Image src={imageUrl}
                               alt="image cmms admin"
                               width={200}
                               height={200}
                        />
                    ) : ''
                }
                <Flex gap={16} align="center">
                    <Upload
                        name="avatar"
                        className="avatar-uploader"
                        showUploadList={false}
                        beforeUpload={beforeUpload}
                    >
                        <Button type="primary" icon={<CloudUploadOutlined />}>Chọn File để upload ảnh</Button>
                    </Upload>
                    {imageUrl ? <Button danger onClick={handleCancelFile} icon={<DeleteOutlined />}>Hủy chọn file</Button> : ''}

                </Flex>
            </Flex>
        </>
    )
}

export default PreviewImage
