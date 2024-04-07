import {CKEditor} from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import {v4 as uuid} from "uuid"

const Editor = ({data, onChange}) => {
    const handleChange = (event, editor) => {
        const data = editor.getData();
        console.log(data);
    };
    if (typeof onChange !== 'function') {
        onChange = handleChange;
    }
    return (
        <CKEditor
            editor={ClassicEditor}
            data={data ?? ''}
            onReady={(editor) => {
                editor.editing.view.change((writer) => {
                    writer.setStyle(
                        "min-height",
                        "200px",
                        editor.editing.view.document.getRoot()
                    );
                    writer.setStyle(
                        "resize",
                        "vertical",
                        editor.editing.view.document.getRoot()
                    );
                });
            }}
            onChange={onChange}
            config={{
                toolbar: {
                    items: [
                        'heading',
                        '|',
                        'bold',
                        'italic',
                        'link',
                        'bulletedList',
                        'numberedList',
                        '|',
                        'indent',
                        'outdent',
                        '|',
                        'blockQuote',
                        'insertTable',
                        'mediaEmbed',
                        '|',
                        'undo',
                        'redo'
                    ]
                },
                language: 'vn',
            }}/>
    )
}
export default Editor
