export const site = {
  name: "PyRecall",
  description: "A fast, keyboard-first Python syntax reference for technical interview preparation.",
  repoUrl: "https://github.com/liangpeter08/interviewrecall",
};

export function topicRequestUrl(query: string): string {
  const title = encodeURIComponent(`Topic request: ${query}`);
  return `${site.repoUrl}/issues/new?title=${title}&labels=content`;
}
