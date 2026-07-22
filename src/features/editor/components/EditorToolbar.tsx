import { Editor } from '@tiptap/react'
import {
  Bold, Italic, Underline, List, ListOrdered, Undo, Redo, Image, Table, SquareFunction
} from 'lucide-react'

export function EditorToolbar({ editor }: { editor: Editor | null }) {
  if (!editor) return null

  return (
    <div className="flex flex-wrap items-center gap-1 p-2 border-b border-border bg-card sticky top-0 z-10">
      <div className="flex items-center space-x-1 border-r pr-2 mr-2">
        <button
          onClick={() => editor.chain().focus().undo().run()}
          disabled={!editor.can().undo()}
          className="p-2 hover:bg-accent rounded disabled:opacity-50"
          title="Undo (Ctrl+Z)"
        >
          <Undo className="w-4 h-4" />
        </button>
        <button
          onClick={() => editor.chain().focus().redo().run()}
          disabled={!editor.can().redo()}
          className="p-2 hover:bg-accent rounded disabled:opacity-50"
          title="Redo (Ctrl+Y)"
        >
          <Redo className="w-4 h-4" />
        </button>
      </div>

      <div className="flex items-center space-x-1 border-r pr-2 mr-2">
        <button
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={`p-2 hover:bg-accent rounded ${editor.isActive('bold') ? 'bg-muted' : ''}`}
          title="Bold (Ctrl+B)"
        >
          <Bold className="w-4 h-4" />
        </button>
        <button
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={`p-2 hover:bg-accent rounded ${editor.isActive('italic') ? 'bg-muted' : ''}`}
          title="Italic (Ctrl+I)"
        >
          <Italic className="w-4 h-4" />
        </button>
        <button
          onClick={() => editor.chain().focus().toggleUnderline().run()}
          className={`p-2 hover:bg-accent rounded ${editor.isActive('underline') ? 'bg-muted' : ''}`}
          title="Underline (Ctrl+U)"
        >
          <Underline className="w-4 h-4" />
        </button>
      </div>

      <div className="flex items-center space-x-1 border-r pr-2 mr-2">
        <button
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={`p-2 hover:bg-accent rounded ${editor.isActive('bulletList') ? 'bg-muted' : ''}`}
        >
          <List className="w-4 h-4" />
        </button>
        <button
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          className={`p-2 hover:bg-accent rounded ${editor.isActive('orderedList') ? 'bg-muted' : ''}`}
        >
          <ListOrdered className="w-4 h-4" />
        </button>
      </div>

      <div className="flex items-center space-x-1">
        <button
          onClick={() => editor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run()}
          className="p-2 hover:bg-accent rounded"
          title="Insert Table"
        >
          <Table className="w-4 h-4" />
        </button>
        <button
          onClick={() => {
            const url = window.prompt('URL')
            if (url) editor.chain().focus().setImage({ src: url }).run()
          }}
          className="p-2 hover:bg-accent rounded"
          title="Insert Image"
        >
          <Image className="w-4 h-4" />
        </button>
        <button
          onClick={() => editor.commands.insertMath('\\int x^2 dx')}
          className="p-2 hover:bg-accent rounded text-primary"
          title="Insert Math Formula"
        >
          <SquareFunction className="w-4 h-4" />
        </button>
      </div>
    </div>
  )
}
