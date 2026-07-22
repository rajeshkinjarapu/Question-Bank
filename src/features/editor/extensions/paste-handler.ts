import { Extension } from '@tiptap/core'
import { Plugin, PluginKey } from '@tiptap/pm/state'
import { uploadFile, getPublicUrl } from '@/lib/supabase/storage'
import { v4 as uuidv4 } from 'uuid'

export const PasteHandler = Extension.create({
  name: 'customPasteHandler',

  addProseMirrorPlugins() {
    return [
      new Plugin({
        key: new PluginKey('pasteHandler'),
        props: {
          handlePaste(view, event, slice) {
            const items = event.clipboardData?.items
            if (!items) return false

            for (const item of Array.from(items)) {
              if (item.type.indexOf('image') === 0) {
                const file = item.getAsFile()
                if (file) {
                  const uploadAndInsert = async () => {
                    try {
                      const fileExt = file.name.split('.').pop() || 'png'
                      const fileName = `${uuidv4()}.${fileExt}`
                      const path = `editor/${fileName}`
                      
                      // 1. Upload to Supabase 'question-diagrams'
                      await uploadFile('question-diagrams', path, file)
                      const url = getPublicUrl('question-diagrams', path)

                      // 2. Insert into TipTap
                      const { schema } = view.state
                      const node = schema.nodes.image.create({ src: url })
                      const transaction = view.state.tr.replaceSelectionWith(node)
                      view.dispatch(transaction)
                    } catch (error) {
                      console.error('Failed to handle pasted image:', error)
                    }
                  }

                  uploadAndInsert()
                  return true // Stop default paste behavior for images
                }
              }
            }

            // Let TipTap handle text/HTML pasting (like from Word)
            // It natively strips malicious scripts and maps to schema
            return false
          },
        },
      }),
    ]
  },
})
