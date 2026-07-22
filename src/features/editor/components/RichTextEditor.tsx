'use client'

import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Underline from '@tiptap/extension-underline'
import Image from '@tiptap/extension-image'
import Table from '@tiptap/extension-table'
import TableRow from '@tiptap/extension-table-row'
import TableCell from '@tiptap/extension-table-cell'
import TableHeader from '@tiptap/extension-table-header'
import { EditorToolbar } from './EditorToolbar'
import { MathExtension } from '../extensions/math-extension'
import { PasteHandler } from '../extensions/paste-handler'
import { useAutoSave } from '../hooks/useAutoSave'

export function RichTextEditor({ 
  questionId, 
  initialContent = '' 
}: { 
  questionId: string, 
  initialContent?: string 
}) {
  const { content, onUpdate, status } = useAutoSave(questionId, initialContent)

  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      Image,
      Table.configure({ resizable: true }),
      TableRow,
      TableHeader,
      TableCell,
      MathExtension,
      PasteHandler
    ],
    content,
    onUpdate: ({ editor }) => {
      onUpdate(editor.getHTML())
    },
    editorProps: {
      attributes: {
        class: 'prose prose-sm sm:prose lg:prose-lg xl:prose-2xl mx-auto focus:outline-none min-h-[300px] p-4',
      },
    },
  })

  return (
    <div className="border border-border rounded-lg overflow-hidden bg-background shadow-sm flex flex-col h-full">
      <EditorToolbar editor={editor} />
      <div className="flex-1 overflow-y-auto bg-card">
        <EditorContent editor={editor} />
      </div>
      <div className="px-4 py-2 bg-muted/50 border-t border-border flex justify-between items-center text-xs text-muted-foreground">
        <span>Word Count: {editor?.storage.characterCount?.words() || 0}</span>
        <span className="capitalize">
          {status === 'saving' && 'Saving...'}
          {status === 'saved' && 'All changes saved.'}
          {status === 'error' && <span className="text-destructive">Failed to save.</span>}
        </span>
      </div>
    </div>
  )
}
