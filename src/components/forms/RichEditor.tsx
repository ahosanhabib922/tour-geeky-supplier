"use client";

import React, { useEffect, useRef, useState } from 'react';
import EditorJS, { OutputData } from '@editorjs/editorjs';

interface RichEditorProps {
  initialContent?: string; // This will be HTML from our DB for now
  onChange: (data: OutputData) => void;
}

export default function RichEditor({ initialContent, onChange }: RichEditorProps) {
  const editorRef = useRef<EditorJS | null>(null);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    return () => {
      if (editorRef.current) {
        editorRef.current.destroy();
        editorRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    if (!isMounted || editorRef.current) return;

    const initEditor = async () => {
      // Import plugins dynamically to avoid SSR issues
      const Header = (await import('@editorjs/header')).default;
      const List = (await import('@editorjs/list')).default;
      const Table = (await import('@editorjs/table')).default;
      const Quote = (await import('@editorjs/quote')).default;
      const Delimiter = (await import('@editorjs/delimiter')).default;
      const Marker = (await import('@editorjs/marker')).default;
      const ImageTool = (await import('@editorjs/image')).default;
      const Checklist = (await import('@editorjs/checklist')).default;
      const LinkTool = (await import('@editorjs/link')).default;
      const Raw = (await import('@editorjs/raw')).default;
      const Warning = (await import('@editorjs/warning')).default;
      const Code = (await import('@editorjs/code')).default;
      const InlineCode = (await import('@editorjs/inline-code')).default;

      const editor = new EditorJS({
        holder: 'editorjs',
        tools: {
          header: {
            class: Header,
            inlineToolbar: true,
            config: {
              placeholder: 'Enter a heading',
              levels: [1, 2, 3, 4],
              defaultLevel: 2
            }
          },
          list: {
            class: List,
            inlineToolbar: true,
            config: {
              defaultStyle: 'unordered'
            }
          },
          checklist: {
            class: Checklist,
            inlineToolbar: true,
          },
          image: {
            class: ImageTool,
            config: {
              uploader: {
                async uploadByFile(file: File) {
                  const formData = new FormData();
                  formData.append("file", file);
                  const res = await fetch("/api/upload", {
                    method: "POST",
                    body: formData,
                  });
                  const data = await res.json();
                  if (data.url) {
                    return {
                      success: 1,
                      file: {
                        url: data.url,
                      }
                    };
                  }
                  return { success: 0 };
                },
                async uploadByUrl(url: string) {
                  return {
                    success: 1,
                    file: {
                      url: url,
                    }
                  };
                }
              }
            }
          },
          linkTool: {
            class: LinkTool,
            config: {
              endpoint: '/api/fetch-url', // We might need this endpoint later
            }
          },
          table: {
            class: Table,
            inlineToolbar: true,
          },
          quote: {
            class: Quote,
            inlineToolbar: true,
            config: {
              quotePlaceholder: 'Enter a quote',
              captionPlaceholder: 'Quote\'s author',
            },
          },
          warning: Warning,
          code: Code,
          inlineCode: InlineCode,
          raw: Raw,
          delimiter: Delimiter,
          marker: Marker,
        },
        placeholder: 'Let`s write an awesome story!',
        data: initialContent && initialContent.startsWith('{') ? JSON.parse(initialContent) : undefined,
        async onChange(api) {
          const data = await api.saver.save();
          onChange(data);
        },
      });

      editorRef.current = editor;
    };


    initEditor();
  }, [isMounted, initialContent]);

  if (!isMounted) return null;

  return (
    <div className="bg-transparent min-h-[600px] transition-all duration-500">
      <style jsx global>{`
        .ce-block__content {
          max-width: 100% !important;
        }

        .ce-toolbar__content {
          max-width: 100% !important;
        }
        .ce-header {
          font-weight: 800;
          color: #111827;
          line-height: 1.2;
          margin-bottom: 0.5em;
          margin-top: 1.5em;
        }
        h1.ce-header { font-size: 2.5rem; }
        h2.ce-header { font-size: 2rem; }
        h3.ce-header { font-size: 1.5rem; }
        h4.ce-header { font-size: 1.25rem; }
        
        .ce-paragraph {
          font-size: 1.125rem;
          line-height: 1.75;
          color: #4B5563;
        }
        
        .cdx-list {
          padding-left: 1.5rem;
          margin: 1rem 0;
        }
        .cdx-list__item {
          padding: 0.25rem 0;
          color: #4B5563;
          list-style-type: disc;
        }
        
        .ce-toolbar__plus, .ce-toolbar__settings-btn {
          background-color: white;
          border: 1px solid #E5E7EB;
          border-radius: 8px;
        }

        .image-tool__image {
          border-radius: 24px;
          overflow: hidden;
          box-shadow: 0 10px 30px -10px rgba(0,0,0,0.1);
        }
        
        .cdx-checklist__item--checked .cdx-checklist__item-checkbox {
          background: #155dfc !important;
          border-color: #155dfc !important;
        }
      `}</style>
      <div id="editorjs" className="prose prose-lg max-w-none prose-headings:text-brand-dark prose-p:text-brand-gray"></div>
    </div>
  );
}


