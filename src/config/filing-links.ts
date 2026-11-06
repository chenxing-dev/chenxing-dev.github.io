export interface FilingLink {
  id: string;
  label: string;
  link: string;
}

export const FILING_LINKS: FilingLink[] = [
  {
    id: "公网安",
    label: "粤公网安备44011102485452号",
    link: "https://beian.mps.gov.cn/#/query/webSearch?code=44011102485452",
  },
  {
    id: "ICP",
    label: "粤ICP备2026167417号",
    link: "https://beian.miit.gov.cn/",
  },
];
