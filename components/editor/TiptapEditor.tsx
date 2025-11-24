"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Link from "@tiptap/extension-link";
import Image from "@tiptap/extension-image";
import CodeBlockLowlight from "@tiptap/extension-code-block-lowlight";
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
        <button
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={`px-3 py-1 rounded ${
            editor.isActive("bold") ? "bg-primary-500 text-white" : "text-dark-text hover:bg-dark-bg"
          }`}
          type="button"
        >
          <strong>B</strong>
        </button>
        <button
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={`px-3 py-1 rounded ${
            editor.isActive("italic") ? "bg-primary-500 text-white" : "text-dark-text hover:bg-dark-bg"
          }`}
          type="button"
        >
          <em>I</em>
        </button>
        <button
          onClick={() => editor.chain().focus().toggleStrike().run()}
          className={`px-3 py-1 rounded ${
            editor.isActive("strike") ? "bg-primary-500 text-white" : "text-dark-text hover:bg-dark-bg"
          }`}
          type="button"
        >
          <s>S</s>
        </button>
        <button
          onClick={() => editor.chain().focus().toggleCode().run()}
          className={`px-3 py-1 rounded ${
            editor.isActive("code") ? "bg-primary-500 text-white" : "text-dark-text hover:bg-dark-bg"
          }`}
          type="button"
        >
          Code
        </button>
        <div className="w-px bg-dark-border mx-1" />
        <button
          onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
          className={`px-3 py-1 rounded ${
            editor.isActive("heading", { level: 1 }) ? "bg-primary-500 text-white" : "text-dark-text hover:bg-dark-bg"
          }`}
          type="button"
        >
          H1
        </button>
        <button
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          className={`px-3 py-1 rounded ${
            editor.isActive("heading", { level: 2 }) ? "bg-primary-500 text-white" : "text-dark-text hover:bg-dark-bg"
          }`}
          type="button"
        >
          H2
        </button>
        <button
          onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
          className={`px-3 py-1 rounded ${
            editor.isActive("heading", { level: 3 }) ? "bg-primary-500 text-white" : "text-dark-text hover:bg-dark-bg"
          }`}
          type="button"
        >
          H3
        </button>
        <div className="w-px bg-dark-border mx-1" />
        <button
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={`px-3 py-1 rounded ${
            editor.isActive("bulletList") ? "bg-primary-500 text-white" : "text-dark-text hover:bg-dark-bg"
          }`}
          type="button"
        >
          • List
        </button>
        <button
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          className={`px-3 py-1 rounded ${
            editor.isActive("orderedList") ? "bg-primary-500 text-white" : "text-dark-text hover:bg-dark-bg"
          }`}
          type="button"
        >
          1. List
        </button>
        <button
          onClick={() => editor.chain().focus().toggleCodeBlock().run()}
          className={`px-3 py-1 rounded ${
            editor.isActive("codeBlock") ? "bg-primary-500 text-white" : "text-dark-text hover:bg-dark-bg"
          }`}
          type="button"
        >
          {"</>"}
        </button>
        <button
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          className={`px-3 py-1 rounded ${
            editor.isActive("blockquote") ? "bg-primary-500 text-white" : "text-dark-text hover:bg-dark-bg"
          }`}
          type="button"
        >
          &quot;
        </button>
        <div className="w-px bg-dark-border mx-1" />
        <button
          onClick={() => editor.chain().focus().setHorizontalRule().run()}
          className="px-3 py-1 rounded text-dark-text hover:bg-dark-bg"
          type="button"
        >
          ―
        </button>
      </div>

      {/* Editor Content */}
      <EditorContent editor={editor} />
    </div>
  );
}