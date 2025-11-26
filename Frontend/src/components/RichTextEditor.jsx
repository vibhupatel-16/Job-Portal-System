import React from "react";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import TextAlign from "@tiptap/extension-text-align";
import Link from "@tiptap/extension-link";
import Image from "@tiptap/extension-image";

const RichTextEditor = ({ value, onChange }) => {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: { levels: [1, 2, 3] },
        underline:false,
        link: false,
      }),
      Underline,
      Link,
      Image,
      TextAlign.configure({ types: ["heading", "paragraph"] }),
    ],
    content: value || "",
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
  });

  if (!editor) return null;

  return (
    <div className="w-full border rounded-md shadow p-3 bg-white">
      {/* Toolbar */}
      <div className="flex flex-wrap gap-2 border-b pb-2 mb-2">

        {/* Headings */}
        {[1, 2, 3].map(level => (
          <button
            key={level}
            onClick={() => editor.chain().focus().toggleHeading({ level }).run()}
            className="px-2 py-1 border rounded"
          >
            H{level}
          </button>
        ))}

        {/* Bold */}
        <button
          onClick={() => editor.chain().focus().toggleBold().run()}
          className="px-2 py-1 border rounded"
        >
          <b>B</b>
        </button>

        {/* Italic */}
        <button
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className="px-2 py-1 border rounded"
        >
          <i>I</i>
        </button>

        {/* Underline */}
        <button
          onClick={() => editor.chain().focus().toggleUnderline().run()}
          className="px-2 py-1 border rounded"
        >
          U
        </button>

        {/* Bullet List */}
        <button
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className="px-2 py-1 border rounded"
        >
          • List
        </button>

        {/* Number List */}
        <button
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          className="px-2 py-1 border rounded"
        >
          1. List
        </button>

        {/* Alignment */}
        {["left", "center", "right"].map(align => (
          <button
            key={align}
            onClick={() => editor.chain().focus().setTextAlign(align).run()}
            className="px-2 py-1 border rounded"
          >
            {align === "left" ? "⬅" : align === "center" ? "⬆" : "➡"}
          </button>
        ))}

        {/* Link */}
        <button
          onClick={() => {
            const url = prompt("Enter URL");
            if (url) editor.chain().focus().setLink({ href: url }).run();
          }}
          className="px-2 py-1 border rounded"
        >
          🔗 Link
        </button>

        {/* Image */}
        <button
          onClick={() => {
            const url = prompt("Enter Image URL");
            if (url) editor.chain().focus().setImage({ src: url }).run();
          }}
          className="px-2 py-1 border rounded"
        >
          🖼 Image
        </button>

        {/* ------------------------------ */}
        {/* ⭐ SOCIAL MEDIA ICON BUTTONS ⭐ */}
        {/* ------------------------------ */}

        {/* Facebook */}
        <button
          onClick={() => {
            const url = prompt("Enter Facebook Profile URL");
            if (url)
              editor.chain().focus().insertContent(
                `<a href="${url}" target="_blank">
                    <img src="https://upload.wikimedia.org/wikipedia/commons/0/05/Facebook_Logo_%282019%29.png" width="30" />
                 </a>`
              ).run();
          }}
          className="px-2 py-1 border rounded"
        >
          📘 Facebook
        </button>

        {/* X / Twitter */}
        <button
          onClick={() => {
            const url = prompt("Enter X (Twitter) Profile URL");
            if (url)
              editor.chain().focus().insertContent(
                `<a href="${url}" target="_blank">
                    <img src="https://upload.wikimedia.org/wikipedia/commons/5/53/X_logo_2023.svg" width="30" />
                 </a>`
              ).run();
          }}
          className="px-2 py-1 border rounded"
        >
          ✖ X
        </button>

        {/* LinkedIn */}
        <button
          onClick={() => {
            const url = prompt("Enter LinkedIn Profile URL");
            if (url)
              editor.chain().focus().insertContent(
                `<a href="${url}" target="_blank">
                    <img src="https://upload.wikimedia.org/wikipedia/commons/c/ca/LinkedIn_logo_initials.png" width="30" />
                 </a>`
              ).run();
          }}
          className="px-2 py-1 border rounded"
        >
          💼 LinkedIn
        </button>

      </div>

      <EditorContent editor={editor} className="min-h-[200px] p-2 rich-text-content" />
    </div>
  );
};

export default RichTextEditor;
