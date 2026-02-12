export function parseOpenAIResponse(resp: any): any {
  // Try to extract text from the response in several common shapes
  let text = '';
  if (!resp) return { raw: '' };

  if ((resp as any).output_text) {
    text = (resp as any).output_text as string;
  } else if (typeof resp === 'string') {
    text = resp;
  } else if (Array.isArray((resp as any).output) && (resp as any).output.length > 0) {
    const out = (resp as any).output as any[];
    for (const item of out) {
      if (item && Array.isArray(item.content)) {
        for (const c of item.content) {
          if (c.type === 'output_text' && c.text) text += c.text;
        }
      }
    }
  }

  if (!text && (resp as any).text && typeof (resp as any).text === 'string') {
    text = (resp as any).text;
  }

  if (!text) text = JSON.stringify(resp);

  const codeBlockMatch = text.match(/```(?:json)?\s*([\s\S]*?)```/i);
  let jsonText = codeBlockMatch ? codeBlockMatch[1].trim() : text.trim();

  const firstArrayStart = jsonText.indexOf('[');
  const firstObjStart = jsonText.indexOf('{');
  if (firstArrayStart !== -1) {
    const lastArrayEnd = jsonText.lastIndexOf(']');
    if (lastArrayEnd !== -1) jsonText = jsonText.slice(firstArrayStart, lastArrayEnd + 1);
  } else if (firstObjStart !== -1) {
    const lastObjEnd = jsonText.lastIndexOf('}');
    if (lastObjEnd !== -1) jsonText = jsonText.slice(firstObjStart, lastObjEnd + 1);
  }

  try {
    return JSON.parse(jsonText);
  } catch (e) {
    return { raw: text };
  }
}
