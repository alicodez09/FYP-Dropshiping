import { CKEditor } from "@ckeditor/ckeditor5-react"
import ClassicEditor from "@ckeditor/ckeditor5-build-classic"

interface CKEditorProps {
    data: string
    onChange: (data: string) => void
    placeholder?: string
}

const CKEditorComponent = ({ data, onChange, placeholder }: CKEditorProps) => {
    return (
        <div className="ckeditor-wrapper">
            <CKEditor
                editor={ClassicEditor}
                data={data}
                onChange={(event: any, editor: any) =>
                    onChange(editor.getData())
                }
                config={{
                    placeholder: placeholder || "Enter your content here...",
                    toolbar: [
                        "heading",
                        "|",
                        "bold",
                        "italic",
                        "link",
                        "bulletedList",
                        "numberedList",
                        "blockQuote",
                        "|",
                        "undo",
                        "redo",
                    ],
                }}
            />
        </div>
    )
}

export default CKEditorComponent
