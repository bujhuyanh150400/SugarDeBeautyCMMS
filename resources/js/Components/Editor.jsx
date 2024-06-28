import {CKEditor} from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import '@ckeditor/ckeditor5-build-classic/build/translations/vi';
const Editor = ({data, onChange,minHeight = 200}) => {
    const handleChange = (event, editor) => {
        const data = editor.getData();
    };
    if (typeof onChange !== 'function') {
        onChange = handleChange;
    }
    return (
        <CKEditor
            editor={ClassicEditor}
            data={data ?? ''}
            className="!text-slate-950"
            onReady={(editor) => {
                editor.editing.view.change((writer) => {
                    writer.setStyle(
                        "min-height",
                        `${minHeight}px`,
                        editor.editing.view.document.getRoot()
                    );
                    writer.setStyle(
                        "resize",
                        "vertical",
                        editor.editing.view.document.getRoot()
                    );
                    writer.setStyle(
                        "color",
                        'black' ,
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
                language: 'vi',
            }}
        />
    )
}
export default Editor
