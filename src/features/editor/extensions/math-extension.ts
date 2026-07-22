import { Node, mergeAttributes, nodeInputRule } from '@tiptap/core'
import { ReactNodeViewRenderer } from '@tiptap/react'
import MathNodeView from '../components/nodes/MathNodeView'

export interface MathOptions {
  HTMLAttributes: Record<string, any>
}

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    math: {
      insertMath: (latex?: string) => ReturnType
    }
  }
}

export const MathExtension = Node.create<MathOptions>({
  name: 'math',

  group: 'inline',
  inline: true,
  selectable: true,
  atom: true,

  addOptions() {
    return {
      HTMLAttributes: {
        class: 'math-node',
      },
    }
  },

  addAttributes() {
    return {
      latex: {
        default: '',
        parseHTML: element => element.getAttribute('data-latex'),
        renderHTML: attributes => {
          return {
            'data-latex': attributes.latex,
          }
        },
      },
    }
  },

  parseHTML() {
    return [
      {
        tag: 'span[data-latex]',
      },
    ]
  },

  renderHTML({ HTMLAttributes }) {
    return ['span', mergeAttributes(this.options.HTMLAttributes, HTMLAttributes)]
  },

  addNodeView() {
    return ReactNodeViewRenderer(MathNodeView)
  },

  addCommands() {
    return {
      insertMath: (latex = '') => ({ commands }) => {
        return commands.insertContent({
          type: this.name,
          attrs: { latex },
        })
      },
    }
  },

  addInputRules() {
    return [
      nodeInputRule({
        find: /\$\$(.+)\$\$$/,
        type: this.type,
        getAttributes: match => {
          return { latex: match[1] }
        },
      }),
    ]
  },
})
