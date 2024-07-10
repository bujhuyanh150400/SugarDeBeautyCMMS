import Layout from "@/Layouts/index.jsx";
import {ButtonGroup, Divider, IconButton, Message, Panel, Text, Tooltip, Whisper} from "rsuite";
import constant from "@/utils/constant.js";
import AttachmentIcon from "@rsuite/icons/Attachment.js";
import FancyBox from "@/Components/FancyBox.jsx";

const View = (props) => {
    const {workflow} = props;

    const {files, images} = workflow.files.reduce((acc, file) => {
        const type = constant.imageExtensions.includes(file.file_extension.toLowerCase()) ? 'images' : 'files';
        acc[type].push(file);
        return acc;
    }, {files: [], images: []});


    return (
        <Layout>
            <Panel bordered shaded header={`Quy trình ${workflow.title}`}>
                <div className="flex flex-col gap-4">
                    <div className="inline-flex items-center gap-4"><Text color={'blue'} weight={'bold'}>Chuyên
                        môn: </Text> <span>{workflow.specialties.name}</span></div>
                    <Text color={'blue'} weight={'bold'}>File đính kèm: </Text>
                    {files.length > 0 ?
                        <div className="flex items-center gap-2">
                            {files.map((file_had_upload, index) => (
                                <ButtonGroup block={true} key={index}>
                                    <Whisper placement="top"
                                             speaker={<Tooltip>Ấn để tải</Tooltip>}>
                                        <IconButton as="a" target="_blank" appearance="ghost"
                                                    href={route('file.show', {filepath: file_had_upload.file_location})}
                                                    icon={
                                                        <AttachmentIcon/>}>{file_had_upload.file_real_name}</IconButton>
                                    </Whisper>
                                </ButtonGroup>
                            ))}
                        </div>
                        :
                        (<Message type={`info`} showIcon={true} className="font-bold">Không có file đính kèm !</Message>)
                    }
                    <Text color={'blue'} weight={'bold'}>Ảnh đính kèm: </Text>
                    {images.length > 0 ?
                        <FancyBox
                            options={{
                                Carousel: {
                                    infinite: false,
                                },
                                contentClick: "toggleCover",
                                Images: {
                                    initialSize: "fit",
                                    Panzoom: {
                                        panMode: "mousemove",
                                        mouseMoveFactor: 1.1,
                                        mouseMoveFriction: 0.12,
                                    },
                                },
                                animate: true
                            }}
                        >
                            <div className={`space-x-4 space-y-2`}>
                                {images.map((image, index) => (
                                    <a key={index} data-fancybox="gallery" href={route('file.show', {filepath: image.file_location})}>
                                        <img src={route('file.show', {filepath: image.file_location})} width="200" height="150" />
                                    </a>
                                ))}
                            </div>
                        </FancyBox>
                        :
                        (<Message type={`info`} showIcon={true} className="font-bold">Không có ảnh đính kèm !</Message>)
                    }
                    <Text color={'blue'} weight={'bold'}>Nội dung: </Text>
                    <Divider />
                    <div dangerouslySetInnerHTML={{ __html: workflow.description }}/>
                </div>
            </Panel>
        </Layout>
    )
}

export default View;
