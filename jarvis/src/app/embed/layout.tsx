/**
 * Layout /embed — marca o documento p/ CSS transparente (sem script no body:
 * script inline quebrava hydration).
 */
export default function EmbedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div data-jarvis-embed className="contents">
      {children}
    </div>
  );
}
