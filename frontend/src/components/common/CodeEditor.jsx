import React, { useState, useRef, useEffect } from 'react';
import { useToast } from '../../context/ToastContext';

export function CodeEditor({
  value = '',
  onChange,
  language = 'Java',
  onReset,
  disabled = false,
  minHeight = '320px',
  readOnly = false
}) {
  const [fontSize, setFontSize] = useState(13.5);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const editorContainerRef = useRef(null);
  const textareaRef = useRef(null);
  const lineNumbersRef = useRef(null);
  const toast = useToast();

  const lines = value.split('\n');
  const lineCount = Math.max(lines.length, 1);

  // Sync line number scroll with textarea
  const handleScroll = () => {
    if (textareaRef.current && lineNumbersRef.current) {
      lineNumbersRef.current.scrollTop = textareaRef.current.scrollTop;
    }
  };

  // Handle Tab indentation & bracket auto-closing
  const handleKeyDown = (e) => {
    if (readOnly || disabled) return;

    const textarea = textareaRef.current;
    if (!textarea) return;

    const { selectionStart, selectionEnd, value: currentVal } = textarea;

    // Handle Tab (insert 4 spaces)
    if (e.key === 'Tab') {
      e.preventDefault();
      const tabSpaces = '    ';
      const newVal = currentVal.substring(0, selectionStart) + tabSpaces + currentVal.substring(selectionEnd);
      onChange?.(newVal);

      setTimeout(() => {
        textarea.selectionStart = textarea.selectionEnd = selectionStart + tabSpaces.length;
      }, 0);
      return;
    }

    // Auto-close brackets and quotes
    const pairs = {
      '(': ')',
      '{': '}',
      '[': ']',
      '"': '"',
      "'": "'"
    };

    if (pairs[e.key]) {
      const openChar = e.key;
      const closeChar = pairs[e.key];

      // If text is highlighted, wrap it
      if (selectionStart !== selectionEnd) {
        e.preventDefault();
        const selectedText = currentVal.substring(selectionStart, selectionEnd);
        const newVal = currentVal.substring(0, selectionStart) + openChar + selectedText + closeChar + currentVal.substring(selectionEnd);
        onChange?.(newVal);
        setTimeout(() => {
          textarea.selectionStart = selectionStart + 1;
          textarea.selectionEnd = selectionEnd + 1;
        }, 0);
        return;
      }

      // If quote and next char is same quote, just advance
      if ((openChar === '"' || openChar === "'") && currentVal[selectionStart] === openChar) {
        e.preventDefault();
        textarea.selectionStart = textarea.selectionEnd = selectionStart + 1;
        return;
      }

      e.preventDefault();
      const newVal = currentVal.substring(0, selectionStart) + openChar + closeChar + currentVal.substring(selectionEnd);
      onChange?.(newVal);
      setTimeout(() => {
        textarea.selectionStart = textarea.selectionEnd = selectionStart + 1;
      }, 0);
      return;
    }

    // Handle auto-closing bracket skip
    if (e.key === ')' || e.key === '}' || e.key === ']') {
      if (currentVal[selectionStart] === e.key) {
        e.preventDefault();
        textarea.selectionStart = textarea.selectionEnd = selectionStart + 1;
        return;
      }
    }

    // Handle Enter with auto-indentation
    if (e.key === 'Enter') {
      const currentLineStart = currentVal.lastIndexOf('\n', selectionStart - 1) + 1;
      const currentLine = currentVal.substring(currentLineStart, selectionStart);
      const matchIndent = currentLine.match(/^\s*/);
      let indent = matchIndent ? matchIndent[0] : '';

      // If last char before newline is '{', add extra indent
      const prevChar = currentVal[selectionStart - 1];
      const nextChar = currentVal[selectionStart];

      if (prevChar === '{') {
        e.preventDefault();
        const extraIndent = indent + '    ';
        if (nextChar === '}') {
          const newVal = currentVal.substring(0, selectionStart) + '\n' + extraIndent + '\n' + indent + currentVal.substring(selectionEnd);
          onChange?.(newVal);
          setTimeout(() => {
            textarea.selectionStart = textarea.selectionEnd = selectionStart + 1 + extraIndent.length;
          }, 0);
        } else {
          const newVal = currentVal.substring(0, selectionStart) + '\n' + extraIndent + currentVal.substring(selectionEnd);
          onChange?.(newVal);
          setTimeout(() => {
            textarea.selectionStart = textarea.selectionEnd = selectionStart + 1 + extraIndent.length;
          }, 0);
        }
      }
    }
  };

  const handleCopy = () => {
    navigator.clipboard?.writeText(value);
    toast.info('Code copied to clipboard');
  };

  const toggleFullscreen = () => {
    setIsFullscreen((prev) => !prev);
  };

  return (
    <div
      ref={editorContainerRef}
      className={`code-editor-wrapper ${isFullscreen ? 'fullscreen-editor' : ''}`}
      style={{ minHeight: isFullscreen ? '100vh' : minHeight }}
    >
      {/* Editor Header Bar */}
      <div className="editor-header">
        <div className="editor-lang-badge">
          <span className="java-icon">☕</span>
          <span>{language} (OpenJDK 17)</span>
        </div>

        <div className="editor-toolbar">
          <div className="editor-zoom-controls">
            <button
              type="button"
              className="btn-icon-tiny"
              onClick={() => setFontSize((s) => Math.max(11, s - 1))}
              title="Decrease Font Size"
            >
              A-
            </button>
            <span className="font-size-label">{fontSize}px</span>
            <button
              type="button"
              className="btn-icon-tiny"
              onClick={() => setFontSize((s) => Math.min(22, s + 1))}
              title="Increase Font Size"
            >
              A+
            </button>
          </div>

          <button
            type="button"
            className="btn-editor-tool"
            onClick={handleCopy}
            title="Copy Code"
          >
            📋 Copy
          </button>

          {onReset && (
            <button
              type="button"
              className="btn-editor-tool"
              onClick={onReset}
              title="Reset Starter Code"
            >
              ↺ Reset
            </button>
          )}

          <button
            type="button"
            className="btn-editor-tool"
            onClick={toggleFullscreen}
            title={isFullscreen ? 'Exit Fullscreen' : 'Fullscreen Editor'}
          >
            {isFullscreen ? '⛶ Minimize' : '⛶ Fullscreen'}
          </button>
        </div>
      </div>

      {/* Editor Surface with Line Numbers and Monospace Textarea */}
      <div className="editor-surface">
        <div
          ref={lineNumbersRef}
          className="line-numbers"
          style={{ fontSize: `${fontSize}px` }}
          aria-hidden="true"
        >
          {Array.from({ length: lineCount }).map((_, i) => (
            <div key={i + 1} className="line-num">
              {i + 1}
            </div>
          ))}
        </div>

        <textarea
          ref={textareaRef}
          className="editor-textarea"
          value={value}
          onChange={(e) => onChange?.(e.target.value)}
          onKeyDown={handleKeyDown}
          onScroll={handleScroll}
          spellCheck="false"
          disabled={disabled}
          readOnly={readOnly}
          style={{
            fontSize: `${fontSize}px`,
            lineHeight: '1.6',
            minHeight: isFullscreen ? 'calc(100vh - 65px)' : minHeight
          }}
          placeholder="// Write your Java solution here..."
        />
      </div>
    </div>
  );
}
