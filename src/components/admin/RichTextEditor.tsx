"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Image from "@tiptap/extension-image";
import Link from "@tiptap/extension-link";
import Placeholder from "@tiptap/extension-placeholder";
import Underline from "@tiptap/extension-underline";
import TextAlign from "@tiptap/extension-text-align";
import { useCallback, useEffect } from "react";

interface RichTextEditorProps {
  name: string;
  value: string;
  onChange: (html: string) => void;
  placeholder?: string;
}

function ToolbarButton({
  onClick,
  isActive,
  icon,
  title,
}: {
  onClick: () => void;
  isActive?: boolean;
  icon: string;
  title: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={isActive ? "is-active" : ""}
      title={title}
    >
      <i className={icon}></i>
    </button>
  );
}

function ToolbarSep() {
  return <div className="separator" />;
}

export default function RichTextEditor({
  name,
  value,
  onChange,
  placeholder = "Mulai menulis konten...",
}: RichTextEditorProps) {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      Image.configure({ HTMLAttributes: { class: "editor-image" } }),
      Link.configure({ openOnClick: false, HTMLAttributes: { rel: "noopener noreferrer" } }),
      Placeholder.configure({ placeholder }),
      TextAlign.configure({ types: ["heading", "paragraph"] }),
    ],
    content: value,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    immediatelyRender: false,
  });

  // Sync external value changes
  useEffect(() => {
    if (editor && value !== editor.getHTML()) {
      editor.commands.setContent(value, { emitUpdate: false });
    }
  }, [value, editor]);

  const addImage = useCallback(() => {
    if (!editor) return;
    const url = window.prompt("URL gambar:");
    if (url) {
      editor.chain().focus().setImage({ src: url }).run();
    }
  }, [editor]);

  const addLink = useCallback(() => {
    if (!editor) return;
    const previousUrl = editor.getAttributes("link").href;
    const url = window.prompt("URL link:", previousUrl);
    if (url === null) return;
    if (url === "") {
      editor.chain().focus().extendMarkRange("link").unsetLink().run();
    } else {
      editor.chain().focus().extendMarkRange("link").setLink({ href: url }).run();
    }
  }, [editor]);

  if (!editor) {
    return (
      <div className="admin-form-group">
        <div style={{ border: "1px solid var(--admin-border)", borderRadius: "var(--admin-radius)", padding: 48, textAlign: "center", color: "var(--admin-text-muted)" }}>
          Loading editor...
        </div>
        <input type="hidden" name={name} value={value} />
      </div>
    );
  }

  return (
    <div className="admin-form-group">
      <input type="hidden" name={name} value={editor.getHTML()} />
      <div style={{ border: "1px solid var(--admin-border)", borderRadius: "var(--admin-radius)", overflow: "hidden" }}>
        <div className="admin-editor-toolbar">
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleBold().run()}
            isActive={editor.isActive("bold")}
            icon="fas fa-bold"
            title="Bold"
          />
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleItalic().run()}
            isActive={editor.isActive("italic")}
            icon="fas fa-italic"
            title="Italic"
          />
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleUnderline().run()}
            isActive={editor.isActive("underline")}
            icon="fas fa-underline"
            title="Underline"
          />
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleStrike().run()}
            isActive={editor.isActive("strike")}
            icon="fas fa-strikethrough"
            title="Strikethrough"
          />
          <ToolbarSep />
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
            isActive={editor.isActive("heading", { level: 2 })}
            icon="fas fa-heading"
            title="Heading 2"
          />
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
            isActive={editor.isActive("heading", { level: 3 })}
            icon="fas fa-h"
            title="Heading 3"
          />
          <ToolbarSep />
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleBulletList().run()}
            isActive={editor.isActive("bulletList")}
            icon="fas fa-list-ul"
            title="Bullet list"
          />
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleOrderedList().run()}
            isActive={editor.isActive("orderedList")}
            icon="fas fa-list-ol"
            title="Numbered list"
          />
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleBlockquote().run()}
            isActive={editor.isActive("blockquote")}
            icon="fas fa-quote-left"
            title="Quote"
          />
          <ToolbarSep />
          <ToolbarButton
            onClick={() => editor.chain().focus().setTextAlign("left").run()}
            isActive={editor.isActive({ textAlign: "left" })}
            icon="fas fa-align-left"
            title="Align left"
          />
          <ToolbarButton
            onClick={() => editor.chain().focus().setTextAlign("center").run()}
            isActive={editor.isActive({ textAlign: "center" })}
            icon="fas fa-align-center"
            title="Align center"
          />
          <ToolbarButton
            onClick={() => editor.chain().focus().setTextAlign("right").run()}
            isActive={editor.isActive({ textAlign: "right" })}
            icon="fas fa-align-right"
            title="Align right"
          />
          <ToolbarSep />
          <ToolbarButton onClick={addLink} isActive={editor.isActive("link")} icon="fas fa-link" title="Add link" />
          <ToolbarButton onClick={addImage} icon="fas fa-image" title="Add image" />
          <ToolbarSep />
          <ToolbarButton
            onClick={() => editor.chain().focus().setHorizontalRule().run()}
            icon="fas fa-minus"
            title="Horizontal rule"
          />
          <ToolbarButton
            onClick={() => editor.chain().focus().undo().run()}
            icon="fas fa-undo"
            title="Undo"
          />
          <ToolbarButton
            onClick={() => editor.chain().focus().redo().run()}
            icon="fas fa-redo"
            title="Redo"
          />
        </div>
        <div className="admin-editor-content">
          <EditorContent editor={editor} />
        </div>
      </div>
    </div>
  );
}
