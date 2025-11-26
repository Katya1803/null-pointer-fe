"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Link from "@tiptap/extension-link";
import Image from "@tiptap/extension-image";
import CodeBlockLowlight from "@tiptap/extension-code-block-lowlight";
import { Table } from "@tiptap/extension-table";
import { TableRow } from "@tiptap/extension-table-row";
import { TableCell } from "@tiptap/extension-table-cell";
import { TableHeader } from "@tiptap/extension-table-header";
import { common, createLowlight } from "lowlight";
import ListItem from "@tiptap/extension-list-item";

const CustomListItem = ListItem.extend({
  content: "paragraph block*",
});

const lowlight = createLowlight(common);

interface TiptapEditorProps {
  content: string;
  onChange: (content: string) => void;
  placeholder?: string;
}

export function TiptapEditor({ content, onChange, placeholder }: TiptapEditorProps) {
  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit.configure({
        codeBlock: false,
      }),
      CustomListItem,
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: "text-primary-500 underline",
        },
      }),
      Image.configure({
        HTMLAttributes: {
          class: "max-w-full h-auto rounded-lg",
        },
      }),
      CodeBlockLowlight.configure({
        lowlight,
        HTMLAttributes: {
          class: "bg-dark-bg rounded-lg p-4 my-4",
        },
      }),
      Table.configure({
        resizable: true,
        HTMLAttributes: {
          class: "border-collapse table-auto w-full my-4",
        },
      }),
      TableRow.configure({
        HTMLAttributes: {
          class: "border border-dark-border",
        },
      }),
      TableHeader.configure({
        HTMLAttributes: {
          class: "border border-dark-border bg-dark-card px-4 py-2 text-left font-semibold",
        },
      }),
      TableCell.configure({
        HTMLAttributes: {
          class: "border border-dark-border px-4 py-2",
        },
      }),
    ],
    content,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class: "prose prose-invert max-w-none focus:outline-none min-h-[300px] px-4 py-3",
      },
    },
  });

  if (!editor) {
    return null;
  }

  return (
    <div className="border border-dark-border rounded-lg bg-dark-card">
      {/* Toolbar */}
      <div className="border-b border-dark-border p-2 flex flex-wrap gap-1">
        {/* Text Formatting */}
        <button
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={`px-3 py-1 rounded ${
            editor.isActive("bold") ? "bg-primary-500 text-white" : "text-dark-text hover:bg-dark-bg"
          }`}
          type="button"
          title="Bold"
        >
          <strong>B</strong>
        </button>
        <button
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={`px-3 py-1 rounded ${
            editor.isActive("italic") ? "bg-primary-500 text-white" : "text-dark-text hover:bg-dark-bg"
          }`}
          type="button"
          title="Italic"
        >
          <em>I</em>
        </button>
        <button
          onClick={() => editor.chain().focus().toggleStrike().run()}
          className={`px-3 py-1 rounded ${
            editor.isActive("strike") ? "bg-primary-500 text-white" : "text-dark-text hover:bg-dark-bg"
          }`}
          type="button"
          title="Strikethrough"
        >
          <s>S</s>
        </button>
        <button
          onClick={() => editor.chain().focus().toggleCode().run()}
          className={`px-3 py-1 rounded ${
            editor.isActive("code") ? "bg-primary-500 text-white" : "text-dark-text hover:bg-dark-bg"
          }`}
          type="button"
          title="Inline Code"
        >
          Code
        </button>

        <div className="w-px bg-dark-border mx-1" />

        {/* Headings */}
        <button
          onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
          className={`px-3 py-1 rounded ${
            editor.isActive("heading", { level: 1 }) ? "bg-primary-500 text-white" : "text-dark-text hover:bg-dark-bg"
          }`}
          type="button"
          title="Heading 1"
        >
          H1
        </button>
        <button
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          className={`px-3 py-1 rounded ${
            editor.isActive("heading", { level: 2 }) ? "bg-primary-500 text-white" : "text-dark-text hover:bg-dark-bg"
          }`}
          type="button"
          title="Heading 2"
        >
          H2
        </button>
        <button
          onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
          className={`px-3 py-1 rounded ${
            editor.isActive("heading", { level: 3 }) ? "bg-primary-500 text-white" : "text-dark-text hover:bg-dark-bg"
          }`}
          type="button"
          title="Heading 3"
        >
          H3
        </button>

        <div className="w-px bg-dark-border mx-1" />

        {/* Lists */}
        <button
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={`px-3 py-1 rounded ${
            editor.isActive("bulletList") ? "bg-primary-500 text-white" : "text-dark-text hover:bg-dark-bg"
          }`}
          type="button"
          title="Bullet List"
        >
          • List
        </button>
        <button
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          className={`px-3 py-1 rounded ${
            editor.isActive("orderedList") ? "bg-primary-500 text-white" : "text-dark-text hover:bg-dark-bg"
          }`}
          type="button"
          title="Numbered List"
        >
          1. List
        </button>

        <div className="w-px bg-dark-border mx-1" />

        {/* Table */}
        <button
          onClick={() => editor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run()}
          className="px-3 py-1 rounded text-dark-text hover:bg-dark-bg"
          type="button"
          title="Insert Table"
        >
          Table
        </button>
        {editor.isActive("table") && (
          <>
            <button
              onClick={() => editor.chain().focus().addColumnAfter().run()}
              className="px-3 py-1 rounded text-dark-text hover:bg-dark-bg"
              type="button"
              title="Add Column"
            >
              Col+
            </button>
            <button
              onClick={() => editor.chain().focus().addRowAfter().run()}
              className="px-3 py-1 rounded text-dark-text hover:bg-dark-bg"
              type="button"
              title="Add Row"
            >
              Row+
            </button>
            <button
              onClick={() => editor.chain().focus().deleteColumn().run()}
              className="px-3 py-1 rounded text-dark-text hover:bg-dark-bg"
              type="button"
              title="Delete Column"
            >
              Col-
            </button>
            <button
              onClick={() => editor.chain().focus().deleteRow().run()}
              className="px-3 py-1 rounded text-dark-text hover:bg-dark-bg"
              type="button"
              title="Delete Row"
            >
              Row-
            </button>
            <button
              onClick={() => editor.chain().focus().deleteTable().run()}
              className="px-3 py-1 rounded text-red-500 hover:bg-dark-bg"
              type="button"
              title="Delete Table"
            >
              Del Table
            </button>
          </>
        )}

        <div className="w-px bg-dark-border mx-1" />

        {/* Code Block & Quote */}
        <button
          onClick={() => editor.chain().focus().toggleCodeBlock().run()}
          className={`px-3 py-1 rounded ${
            editor.isActive("codeBlock") ? "bg-primary-500 text-white" : "text-dark-text hover:bg-dark-bg"
          }`}
          type="button"
          title="Code Block"
        >
          {"</>"}
        </button>
        <button
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          className={`px-3 py-1 rounded ${
            editor.isActive("blockquote") ? "bg-primary-500 text-white" : "text-dark-text hover:bg-dark-bg"
          }`}
          type="button"
          title="Blockquote"
        >
          &quot;
        </button>

        <div className="w-px bg-dark-border mx-1" />

        {/* Horizontal Rule */}
        <button
          onClick={() => editor.chain().focus().setHorizontalRule().run()}
          className="px-3 py-1 rounded text-dark-text hover:bg-dark-bg"
          type="button"
          title="Horizontal Rule"
        >
          ―
        </button>
      </div>

      {/* Editor Content */}
      <EditorContent editor={editor} />

      {/* Custom CSS for lists and tables */}
      <style jsx global>{`
        .ProseMirror ul {
          list-style-type: disc;
          padding-left: 1.5rem;
        }
        
        .ProseMirror ol {
          list-style-type: decimal;
          padding-left: 1.5rem;
        }
        
        .ProseMirror ul ul {
          list-style-type: circle;
        }
        
        .ProseMirror ul ul ul {
          list-style-type: square;
        }
        
        .ProseMirror li {
          margin: 0.25rem 0;
        }
        
        .ProseMirror table {
          border-collapse: collapse;
          table-layout: fixed;
          width: 100%;
          margin: 1rem 0;
          overflow: hidden;
        }
        
        .ProseMirror table td,
        .ProseMirror table th {
          min-width: 1em;
          border: 1px solid #262626;
          padding: 0.5rem 1rem;
          vertical-align: top;
          box-sizing: border-box;
          position: relative;
        }
        
        .ProseMirror table th {
          font-weight: bold;
          text-align: left;
          background-color: #141414;
        }
        
        .ProseMirror table .selectedCell:after {
          z-index: 2;
          position: absolute;
          content: "";
          left: 0;
          right: 0;
          top: 0;
          bottom: 0;
          background: rgba(34, 197, 94, 0.1);
          pointer-events: none;
        }
        
        .ProseMirror table .column-resize-handle {
          position: absolute;
          right: -2px;
          top: 0;
          bottom: -2px;
          width: 4px;
          background-color: #22c55e;
          pointer-events: none;
        }
        
        .ProseMirror.resize-cursor {
          cursor: ew-resize;
          cursor: col-resize;
        }
      `}</style>
    </div>
  );
}