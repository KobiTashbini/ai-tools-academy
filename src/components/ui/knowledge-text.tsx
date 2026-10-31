// Isolate embedded English terms so punctuation follows the Hebrew paragraph correctly.
export function KnowledgeText({ text }: { text: string }) {
  return text.split(/(\.?[A-Za-z][A-Za-z0-9]*(?:[ .+#/-]+[A-Za-z0-9]+)*[+#]*)/g).map((part, index) =>
    index % 2 ? <bdi dir="ltr" key={index}>{part}</bdi> : part,
  );
}
