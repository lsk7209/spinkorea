import { useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import ToolLayout from "@/components/ToolLayout";

const SAMPLE_MARKDOWN = `## Markdown Preview (예시)

## 이것은 H2 제목입니다
*이탤릭체*와 **볼드체**를 지원합니다.

### 리스트 아이템
- 항목 1
- 항목 2
  - 하위 항목

### 코드 블록
\`\`\`javascript
const message = "Hello, SpinFlow!";
\`\`\`

### 테이블
| 이름 | 나이 | 직업 |
|---|---|---|
| 홍길동 | 20 | 학생 |
| 김철수 | 30 | 개발자 |
`;

export default function MarkdownPreviewer() {
  const [markdown, setMarkdown] = useState(SAMPLE_MARKDOWN);

  return (
    <ToolLayout
      title="마크다운 프리뷰어"
      description="Markdown 문법을 실시간으로 미리보기 하세요. README 작성이나 블로그 글 쓰기에 유용합니다."
      keywords="markdown previewer, 마크다운 미리보기, md 뷰어, 마크다운 에디터, readme 작성"
      howToUse={[
        "왼쪽 편집창에 마크다운 텍스트를 입력하세요.",
        "오른쪽 미리보기창에서 실시간으로 렌더링된 결과를 확인하세요.",
        "# 제목, **굵게**, *기울임*, - 목록, `코드` 문법을 사용하세요.",
      ]}
      faqs={[
        {
          question: "GitHub Flavored Markdown(GFM)을 지원하나요?",
          answer:
            "네, 테이블, 체크박스, 코드 블록 하이라이팅 등 GFM 확장 문법을 지원합니다.",
        },
        {
          question: "작성한 마크다운을 저장할 수 있나요?",
          answer:
            "현재는 클립보드 복사만 지원합니다. 작성한 내용을 복사하여 .md 파일로 저장하시면 됩니다.",
        },
      ]}
      relatedTools={[
        {
          name: "글자수 세기",
          path: "/tools/text-counter",
          description: "자소서·블로그 글자수",
        },
        {
          name: "Diff 비교",
          path: "/tools/diff-checker",
          description: "텍스트 차이 비교",
        },
        {
          name: "로렘 입숨",
          path: "/tools/lorem-ipsum",
          description: "더미 텍스트 생성",
        },
      ]}
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 h-[600px] max-w-7xl mx-auto">
        {/* Editor */}
        <div className="flex flex-col gap-2">
          <label className="text-sm text-gray-400 font-bold flex items-center justify-between">
            <span>Markdown 입력</span>
            <button
              onClick={() => setMarkdown("")}
              className="text-xs text-red-400 hover:text-red-300 transition-colors"
            >
              모두 지우기
            </button>
          </label>
          <textarea
            value={markdown}
            onChange={(e) => setMarkdown(e.target.value)}
            className="flex-1 bg-black/30 border border-white/20 rounded-xl p-4 text-gray-300 font-mono text-sm leading-relaxed resize-none focus:outline-none focus:border-neon-primary"
            placeholder="마크다운 내용을 입력하세요."
          />
        </div>

        {/* Preview */}
        <div className="flex flex-col gap-2">
          <label className="text-sm text-gray-400 font-bold">
            미리보기 (Preview)
          </label>
          <div className="flex-1 bg-white border border-white/20 rounded-xl p-6 overflow-y-auto prose prose-sm max-w-none prose-slate dark:prose-invert">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>
              {markdown}
            </ReactMarkdown>
          </div>
        </div>
      </div>
    </ToolLayout>
  );
}
