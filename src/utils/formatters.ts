import { MessageStatus } from "@/types";

export const formatMessageContent = (content: string): string => {
  if (!content) return '';
  let formatted = content.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
  formatted = formatted.replace(/\*(.*?)\*/g, '<em>$1</em>');
  formatted = formatted.replace(/^- (.*?)(?:\n|$)/gm, '<li>$1</li>');
  formatted = formatted.replace(/(<li>.*?<\/li>)/gs, '<ul>$1</ul>');
  formatted = formatted.replace(/^\d+\. (.*?)(?:\n|$)/gm, '<li>$1</li>');
  formatted = formatted.replace(/(<li>.*?<\/li>)/gs, '<ol>$1></ol>');
  formatted = formatted.replace(/\n\n/g, '</p><p>');
  if (!formatted.startsWith('<p>')) {
    formatted = `<p>${formatted}</p>`;
  }
  return formatted;
};

export const getMessageStatusIcon = (status: MessageStatus): string => {
  if (status === 'delivered' || status === 'read') {
    return 'check-check';
  }
  return 'check';
};

export const debounce = <F extends (...args: unknown[]) => unknown>(
  func: F,
  waitFor: number
) => {
  let timeout: ReturnType<typeof setTimeout> | null = null;
  return (...args: Parameters<F>): Promise<ReturnType<F>> => {
    if (timeout !== null) {
      clearTimeout(timeout);
    }
    return new Promise((resolve) => {
      timeout = setTimeout(() => resolve(func(...args) as ReturnType<F>), waitFor);
    });
  };
};

export const getFormattedTextWithShortcut = (
  text: string,
  selectionStart: number,
  selectionEnd: number,
  shortcut: 'bold' | 'italic' | 'link'
): { text: string; newCursorPos: number } => {
  const selectedText = text.substring(selectionStart, selectionEnd);
  let newText = '';
  let newCursorPos = 0;

  if (shortcut === 'link') {
    if (selectedText) {
      newText = text.substring(0, selectionStart) + `[${selectedText}](url)` + text.substring(selectionEnd);
      newCursorPos = selectionEnd + 7;
    } else {
      newText = text.substring(0, selectionStart) + '[](url)' + text.substring(selectionEnd);
      newCursorPos = selectionStart + 1;
    }
  } else {
    newText = text;
    newCursorPos = selectionEnd;
  }

  return { text: newText, newCursorPos };
};
