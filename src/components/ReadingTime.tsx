interface ReadingTimeProps {
  content: string;
  className?: string;
}

export function ReadingTime({ content, className = "" }: ReadingTimeProps) {
  // Strip HTML tags and count words
  const text = content.replace(/<[^>]*>/g, "");
  const words = text.trim().split(/\s+/).length;

  // Average reading speed: 200 words per minute
  const minutes = Math.ceil(words / 200);

  return (
    <span className={`text-gray-500 ${className}`}>
      {minutes} min leestijd
    </span>
  );
}

export function calculateReadingTime(content: string): number {
  const text = content.replace(/<[^>]*>/g, "");
  const words = text.trim().split(/\s+/).length;
  return Math.ceil(words / 200);
}
