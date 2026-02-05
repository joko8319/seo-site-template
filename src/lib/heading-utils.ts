// Helper function to add IDs to headings in content
export function addHeadingIds(content: string): string {
  let counter = 0;
  return content.replace(/<h([23])([^>]*)>([^<]+)<\/h[23]>/gi, (match, level, attrs, text) => {
    const id = attrs.includes("id=") ? attrs : ` id="heading-${counter++}"${attrs}`;
    return `<h${level}${id}>${text}</h${level}>`;
  });
}
