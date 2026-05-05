import { Link } from "react-router-dom";
import type { BlogPost } from "./posts";
import contentPlan from "./content-plan.generated.json";

export interface GeneratedArticlePlan {
  id: string;
  slug: string;
  title: string;
  description: string;
  date: string;
  publishAt: string;
  category: string;
  contentType: string;
  searchIntent: string;
  mainKeyword: string;
  expandedKeywords: string[];
  readerProblem: string;
  practicalExample: string;
  primarySourceName: string;
  primarySourceUrl: string;
  internalLinks: { label: string; path: string }[];
  tags: string[];
  thumbnail: string;
  qualityScore: number;
}

const ARTICLES = contentPlan as GeneratedArticlePlan[];

function hasFinalConsonant(value: string): boolean {
  const last = [...value.trim()].at(-1);
  if (!last) {
    return false;
  }
  const code = last.charCodeAt(0);
  return code >= 0xac00 && code <= 0xd7a3 && (code - 0xac00) % 28 !== 0;
}

function particle(value: string, consonant: string, vowel: string): string {
  return `${value}${hasFinalConsonant(value) ? consonant : vowel}`;
}

function withEulReul(value: string): string {
  return particle(value, "을", "를");
}

function withWaGwa(value: string): string {
  return particle(value, "과", "와");
}

function contentTypeLabel(value: string): string {
  const labels: Record<string, string> = {
    "How-to": "실행 가이드",
    Checklist: "체크리스트",
    Explainer: "개념 설명",
    Comparison: "비교 글",
    FAQ: "질문형 글",
  };
  return labels[value] ?? value;
}

function keywordAt(article: GeneratedArticlePlan, index: number): string {
  return article.expandedKeywords[index] ?? article.mainKeyword;
}

function keywordText(article: GeneratedArticlePlan): string {
  const visibleKeywords = article.expandedKeywords.filter((keyword) => !article.mainKeyword.includes(keyword));
  return [article.mainKeyword, ...visibleKeywords].join(", ");
}

function articleVariant(article: GeneratedArticlePlan): number {
  const number = Number(article.id.replace(/\D/g, ""));
  return Number.isFinite(number) ? number % 5 : 0;
}

function buildFaq(article: GeneratedArticlePlan) {
  return [
    {
      question: `${article.mainKeyword}을 처음 적용할 때 가장 먼저 볼 것은 무엇인가요?`,
      answer: `${withWaGwa(keywordAt(article, 0))} ${withEulReul(keywordAt(article, 1))} 먼저 나누면 ${withEulReul(article.readerProblem)} 줄일 수 있습니다. 선택지를 늘리기보다 기준과 예외를 먼저 정하는 편이 안정적입니다.`,
    },
    {
      question: `${article.practicalExample}에는 어떤 기준이 실용적인가요?`,
      answer: `${withEulReul(keywordAt(article, 2))} 기준으로 시작하고, 결과 공유가 필요하다면 ${keywordAt(article, 3)}까지 남기는 방식이 좋습니다. 그래야 다음에도 같은 상황을 설명하기 쉽습니다.`,
    },
    {
      question: `${article.mainKeyword} 결과가 마음에 들지 않으면 다시 정해도 되나요?`,
      answer: "가능하지만 반복 횟수를 미리 정해야 합니다. 기준 없이 계속 다시 고르면 공정성보다 취향이 앞서고, 기록의 신뢰도도 낮아집니다.",
    },
    {
      question: `${article.mainKeyword}을 글이나 도구 페이지에 연결할 때 주의할 점은 무엇인가요?`,
      answer: "독자가 바로 실행할 수 있는 내부 링크와 공식 참고 자료를 함께 제시해야 합니다. 설명만 있고 실행 경로가 없으면 체류와 전환이 모두 약해집니다.",
    },
  ];
}

function TypeSpecificSection({ article }: { article: GeneratedArticlePlan }) {
  if (article.contentType === "Checklist") {
    return (
      <>
        <h2>{article.mainKeyword} 체크리스트는 어떻게 나누면 좋을까요?</h2>
        <div className="grid gap-3 md:grid-cols-3">
          {[
            ["시작 전", `${keywordAt(article, 0)} 기준을 먼저 정하고 선택지를 정리합니다.`],
            ["진행 중", `${keywordAt(article, 1)} 단계에서 예외가 생기면 기록으로 남깁니다.`],
            ["공유 후", `${keywordAt(article, 3)}를 확인해 다음 실행에 같은 기준을 씁니다.`],
          ].map(([phase, text]) => (
            <div key={phase} className="rounded-lg border border-slate-200 bg-white p-4">
              <p className="font-bold text-slate-950">{phase}</p>
              <p className="mt-2 text-sm text-slate-600">{text}</p>
            </div>
          ))}
        </div>
      </>
    );
  }

  if (article.contentType === "Comparison") {
    return (
      <>
        <h2>{article.mainKeyword}을 감으로 고를 때와 기준으로 고를 때 차이</h2>
        <div className="overflow-x-auto">
          <table>
            <thead>
              <tr>
                <th>방식</th>
                <th>장점</th>
                <th>주의점</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>즉흥 선택</td>
                <td>빠르게 끝납니다</td>
                <td>{article.readerProblem}이 반복될 수 있습니다</td>
              </tr>
              <tr>
                <td>기준 선택</td>
                <td>{keywordAt(article, 0)}를 설명하기 쉽습니다</td>
                <td>처음 한 번 기준을 적어야 합니다</td>
              </tr>
              <tr>
                <td>도구 사용</td>
                <td>{keywordAt(article, 3)}까지 남기기 쉽습니다</td>
                <td>입력값 정리가 먼저 필요합니다</td>
              </tr>
            </tbody>
          </table>
        </div>
      </>
    );
  }

  if (article.contentType === "FAQ") {
    return (
      <>
        <h2>{article.mainKeyword} 질문을 먼저 정리해야 하는 이유</h2>
        <p>
          FAQ형 글은 답을 길게 늘리는 것보다 독자가 실제로 망설이는 지점을 먼저 보여주는 편이 좋습니다.
          {keywordAt(article, 0)}, {keywordAt(article, 1)}, {keywordAt(article, 2)}를 질문 단위로 나누면
          검색 의도와 본문 구조가 자연스럽게 맞아집니다.
        </p>
      </>
    );
  }

  if (article.contentType === "Explainer") {
    return (
      <>
        <h2>{article.mainKeyword}을 쉽게 이해하는 기준</h2>
        <p>
          {article.mainKeyword}은 결과만 보면 단순해 보이지만 실제로는 {keywordAt(article, 0)},{" "}
          {keywordAt(article, 1)}, {keywordAt(article, 2)}가 함께 움직입니다. 이 세 가지를 분리하면
          같은 결과라도 왜 그렇게 판단했는지 설명하기 쉬워집니다.
        </p>
      </>
    );
  }

  return (
    <>
      <h2>{article.mainKeyword} 실행 흐름을 지치지 않게 만드는 법</h2>
      <p>
        먼저 {keywordAt(article, 0)}를 정하고, 그다음 {keywordAt(article, 1)}를 확인합니다. 마지막으로{" "}
        {keywordAt(article, 2)}와 {keywordAt(article, 3)}를 남기면 다음번에도 같은 판단을 반복하지 않아도 됩니다.
      </p>
    </>
  );
}

function ContextSection({ article }: { article: GeneratedArticlePlan }) {
  const variant = articleVariant(article);

  if (variant === 1) {
    return (
      <>
        <h2>{article.mainKeyword}을 실제 상황에 맞추는 방법</h2>
        <p>
          {article.practicalExample}에는 정답 하나보다 납득 가능한 절차가 더 중요합니다. 먼저 {keywordAt(article, 0)}를
          확인하고, 이해관계자가 헷갈릴 수 있는 {keywordAt(article, 1)}을 짧게 적어두면 결과 설명이 쉬워집니다.
        </p>
      </>
    );
  }

  if (variant === 2) {
    return (
      <>
        <h2>{article.mainKeyword}을 문서로 남길 때 필요한 것</h2>
        <p>
          실행 후에는 결과만 저장하지 말고 왜 그 방식으로 정했는지 함께 남기는 편이 좋습니다. {keywordAt(article, 2)}와{" "}
          {keywordAt(article, 3)}를 같이 적으면 나중에 같은 조건을 다시 확인할 때 설명 비용이 줄어듭니다.
        </p>
      </>
    );
  }

  if (variant === 3) {
    return (
      <>
        <h2>{article.mainKeyword}에서 먼저 버릴 조건</h2>
        <p>
          모든 조건을 한 번에 반영하려고 하면 오히려 판단이 느려집니다. 이번 결정에 직접 영향을 주지 않는 후보를
          덜어내고 {keywordAt(article, 0)}와 {keywordAt(article, 2)}만 먼저 남기면 실행 속도가 빨라집니다.
        </p>
      </>
    );
  }

  if (variant === 4) {
    return (
      <>
        <h2>{article.mainKeyword}을 반복 운영할 때의 기준</h2>
        <p>
          한 번 쓰고 끝나는 기준과 매번 다시 쓰는 기준은 다르게 설계해야 합니다. 반복 운영에서는 {keywordAt(article, 1)}을
          고정하고 {keywordAt(article, 3)}만 상황에 따라 바꾸는 방식이 관리하기 쉽습니다.
        </p>
      </>
    );
  }

  return (
    <>
      <h2>{article.mainKeyword}을 빠르게 점검하는 관점</h2>
      <p>
        가장 먼저 볼 것은 결과의 화려함이 아니라 독자가 바로 따라 할 수 있는지입니다. {withWaGwa(keywordAt(article, 0))}{" "}
        {keywordAt(article, 1)}이 본문 안에서 자연스럽게 이어지면 검색 의도와 실행 흐름이 같이 살아납니다.
      </p>
    </>
  );
}

function GeneratedArticle({ article }: { article: GeneratedArticlePlan }) {
  const faq = buildFaq(article);
  const checklist = [
    `${article.mainKeyword}을 쓰는 목적을 한 문장으로 적기`,
    `${keywordAt(article, 0)} 기준과 예외를 분리하기`,
    `${keywordAt(article, 1)} 결과를 나중에 확인할 수 있게 남기기`,
    `${keywordAt(article, 2)} 단계에서 필요한 링크와 자료 확인하기`,
  ];

  return (
    <div className="space-y-7">
      <p>
        {article.mainKeyword}은 막연한 감으로 처리하면 시간이 늘어지는 주제입니다. 이 글은{" "}
        {article.readerProblem} 상황에서 바로 적용할 수 있도록 기준, 절차, 확인 항목을 한 번에 정리했습니다.
      </p>

      <div className="rounded-xl border border-cyan-100 bg-cyan-50 p-5 text-slate-800">
        <p className="font-bold text-cyan-900">핵심 요약</p>
        <ul className="mt-3 list-disc space-y-2 pl-5">
          <li>{article.mainKeyword}은 목적과 제외 조건을 먼저 정해야 흔들리지 않습니다.</li>
          <li>{article.expandedKeywords.slice(0, 2).join(", ")}를 나눠 보면 실행 순서가 분명해집니다.</li>
          <li>발행, 공유, 업무 적용 전에는 체크리스트로 한 번 더 검토하는 편이 안전합니다.</li>
        </ul>
      </div>

      <h2>{article.mainKeyword}은 언제 필요할까요?</h2>
      <p>
        가장 흔한 장면은 {article.practicalExample}입니다. 이때 사람들은 빠른 결론을 원하지만, 기준이 없으면
        같은 결정을 반복해서 다시 논의하게 됩니다. {article.mainKeyword}을 별도 기준으로 분리하면 선택지,
        제약, 결과를 나눠 볼 수 있어 실수가 줄어듭니다.
      </p>
      <p>
        특히 {withWaGwa(keywordAt(article, 0))} {keywordAt(article, 1)}가 함께 걸린 상황에서는 단순 추천보다 재사용 가능한
        규칙이 더 중요합니다. 한 번 정한 규칙은 회의, 문서, 개인 일정, 콘텐츠 운영에도 반복해서 적용할 수 있습니다.
      </p>

      <TypeSpecificSection article={article} />

      <ContextSection article={article} />

      <h2>{article.mainKeyword} 기준은 어떻게 잡아야 하나요?</h2>
      <div className="overflow-x-auto">
        <table>
          <thead>
            <tr>
              <th>구분</th>
              <th>확인할 질문</th>
              <th>권장 기준</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>목적</td>
              <td>왜 지금 판단이 필요한가?</td>
              <td>{article.searchIntent}에 맞는 결과만 남깁니다</td>
            </tr>
            <tr>
              <td>범위</td>
              <td>어디까지 자동화하거나 단순화할 수 있나?</td>
              <td>{withEulReul(keywordAt(article, 2))} 기준으로 제외 조건을 둡니다</td>
            </tr>
            <tr>
              <td>검증</td>
              <td>결과가 실제로 쓸 만한가?</td>
              <td>기록, 비교, 재사용 가능성을 함께 봅니다</td>
            </tr>
          </tbody>
        </table>
      </div>

      <h2>{article.mainKeyword} 실행 순서는 어떻게 정리하나요?</h2>
      <ol>
        <li>먼저 {article.mainKeyword}의 목표를 한 줄로 적습니다.</li>
        <li>{keywordAt(article, 0)}에 맞는 선택지를 3~7개로 줄입니다.</li>
        <li>{keywordAt(article, 1)} 기준으로 우선순위를 표시합니다.</li>
        <li>결과를 저장하고 다음번에 같은 기준을 재사용합니다.</li>
      </ol>
      <p>
        이 방식은 결론을 억지로 밀어붙이기 위한 요령이 아닙니다. 같은 문제를 다시 만났을 때 처음부터 고민하지
        않기 위한 운영 방식입니다. SpinFlow의 도구를 함께 쓰면 선택지 정리와 결과 기록을 더 쉽게 만들 수 있습니다.
      </p>

      <h2>{article.mainKeyword} 운영에서 놓치기 쉬운 점</h2>
      <p>
        {contentTypeLabel(article.contentType)} 유형의 글이나 업무 문서에서는 결과보다 과정 설명이 더 중요해질 때가 많습니다.
        예를 들어 {article.practicalExample}에는 모두가 같은 기준으로 판단했다는 신호가 필요합니다.
        기준을 공개하지 않으면 결과가 맞아도 설득력이 낮아지고, 기준을 너무 복잡하게 만들면 실행자가 다시 해석해야 합니다.
      </p>
      <ul>
        <li>결과 화면이나 공유 문구에는 {keywordAt(article, 3)} 기준을 짧게 남깁니다.</li>
        <li>반복해서 쓰는 상황이라면 같은 입력 형식과 같은 순서를 유지합니다.</li>
        <li>예외가 생기면 결과를 바꾸기보다 다음 회차 규칙에 반영합니다.</li>
      </ul>

      <h2>실행 전 체크리스트</h2>
      <ul className="list-none space-y-2 pl-0">
        {checklist.map((item) => (
          <li key={item} className="flex gap-2">
            <span aria-hidden="true">[ ]</span>
            <span>{item}</span>
          </li>
        ))}
      </ul>

      <h2>함께 보면 좋은 SpinFlow 도구</h2>
      <p>
        아래 도구는 {article.mainKeyword}과 직접 연결되는 흐름입니다. 글을 읽은 뒤 바로 실행할 수 있도록 내부
        링크를 함께 정리했습니다.
      </p>
      <ul>
        {article.internalLinks.map((link) => (
          <li key={link.path}>
            <Link to={link.path}>{link.label}</Link>
          </li>
        ))}
      </ul>

      <h2>근거와 참고 자료</h2>
      <p>
        공식 문서와 공개 자료를 확인할 때는 최신 날짜, 적용 범위, 예외 조건을 함께 봐야 합니다. 이 글에서는{" "}
        {article.primarySourceName} 자료를 기본 참고 출처로 삼고, 실제 사용자는 자신의 상황에 맞게 세부 조건을
        확인하는 방식을 권장합니다.
      </p>
      <p>
        참고:{" "}
        <a href={article.primarySourceUrl} target="_blank" rel="noreferrer">
          {article.primarySourceName}
        </a>
      </p>

      <h2>자주 묻는 질문</h2>
      {faq.map((item, index) => (
        <p key={item.question}>
          <strong>
            Q{index + 1}. {item.question}
          </strong>
          <br />
          {item.answer}
        </p>
      ))}
      <p>
        <strong>핵심 키워드</strong>
        <br />
        {keywordText(article)}
      </p>
    </div>
  );
}

export const GENERATED_BLOG_POSTS: BlogPost[] = ARTICLES.map((article) => ({
  slug: article.slug,
  title: article.title,
  description: article.description,
  date: article.date,
  publishAt: article.publishAt,
  tags: article.tags,
  thumbnail: article.thumbnail,
  qualityScore: article.qualityScore,
  content: <GeneratedArticle article={article} />,
}));

export { ARTICLES as GENERATED_ARTICLE_PLANS };
