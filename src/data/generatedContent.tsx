import { Link } from "react-router-dom";
import type { BlogPost } from "./posts";
import contentManifest from "./generated-content-manifest.generated.json";

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
  body?: string;
}

const ARTICLE_CHUNK_BY_SLUG = contentManifest as Record<string, string>;
const ARTICLE_CHUNKS = import.meta.glob("./generated-content-chunks/*.json", {
  import: "default",
}) as Record<string, () => Promise<GeneratedArticlePlan[]>>;

// ─── 언어 파티클 헬퍼 ──────────────────────────────────────────────
function hasFinalConsonant(value: string): boolean {
  const last = [...value.trim()].at(-1);
  if (!last) return false;
  const code = last.charCodeAt(0);
  return code >= 0xac00 && code <= 0xd7a3 && (code - 0xac00) % 28 !== 0;
}
function particle(v: string, c: string, vw: string) { return `${v}${hasFinalConsonant(v) ? c : vw}`; }
function withEulReul(v: string) { return particle(v, "을", "를"); }
function withObjectPhrase(v: string) { return v.endsWith("확인") || v.endsWith("점검") ? `${v} 항목을` : withEulReul(v); }
function withEunNeun(v: string) { return particle(v, "은", "는"); }
function withWaGwa(v: string) { return particle(v, "과", "와"); }
function withIga(v: string) { return particle(v, "이", "가"); }
function withRo(v: string) { return particle(v, "으로", "로"); }

function contentTypeLabel(v: string) {
  return ({ "How-to": "실행 가이드", Checklist: "체크리스트", Explainer: "개념 설명", Comparison: "비교 글", FAQ: "질문형 글" }[v] ?? v);
}
function keywordAt(a: GeneratedArticlePlan, i: number) { return a.expandedKeywords[i] ?? a.mainKeyword; }
function keywordText(a: GeneratedArticlePlan) {
  return [a.mainKeyword, ...a.expandedKeywords.filter(k => !a.mainKeyword.includes(k))].join(", ");
}
function articleVariant(a: GeneratedArticlePlan) { const n = Number(a.id.replace(/\D/g, "")); return Number.isFinite(n) ? n % 6 : 0; }
function toneVariant(a: GeneratedArticlePlan) { const n = Number(a.id.replace(/\D/g, "")); return Number.isFinite(n) ? n % 8 : 0; }
function mistakeVariant(a: GeneratedArticlePlan) { const n = Number(a.id.replace(/\D/g, "")); return Number.isFinite(n) ? Math.floor(n / 3) % 4 : 0; }
function tipVariant(a: GeneratedArticlePlan) { const n = Number(a.id.replace(/\D/g, "")); return Number.isFinite(n) ? Math.floor(n / 7) % 4 : 0; }

// ─── FAQ 빌더 ────────────────────────────────────────────────────
function buildFaq(a: GeneratedArticlePlan) {
  const [k0, k1, k2, k3] = [0, 1, 2, 3].map(i => keywordAt(a, i));
  const tone = toneVariant(a);

  // Q1: readerProblem을 질문 앵커로 사용
  const q1answers = [
    `${withEunNeun(a.mainKeyword)} 목적을 한 줄로 정하지 않으면 "${a.readerProblem}"이 생기기 쉽습니다. ${withObjectPhrase(k0)} 먼저 확인하고 이번 결정에 직접 영향을 주지 않는 선택지를 제거하면 실행 중 흔들리지 않습니다.`,
    `"${a.readerProblem}"의 가장 흔한 원인은 기준 없이 결과를 먼저 내려는 데 있습니다. ${withObjectPhrase(k0)} 먼저 정하고 선택지를 3~5개로 줄이면 같은 논의를 반복하는 상황을 막을 수 있습니다.`,
    `${withEunNeun(a.mainKeyword)} 실행 목적을 한 줄로 적는 것부터 시작합니다. "${a.readerProblem}" 문제는 대부분 ${k0} 기준이 불명확할 때 발생하므로, 이를 먼저 확인하면 이후 단계가 빠릅니다.`,
    `처음 적용할 때 "${a.readerProblem}"이 생기는 이유는 ${withEunNeun(k0)} 현재 상황에 맞는지 확인하지 않아서입니다. ${k1}까지 함께 정리하면 예외 상황에서도 판단 기준이 흔들리지 않습니다.`,
  ];

  // Q2: practicalExample을 질문 앵커로 사용
  const q2answers = [
    `${a.practicalExample} 상황에서 가장 먼저 할 일은 ${withObjectPhrase(k2)} 기준으로 선택지를 좁히는 것입니다. 참여자 모두가 같은 기준으로 결과를 받아들일 수 있도록 결정 근거를 짧게 공개하면 납득도가 높아집니다.`,
    `${a.practicalExample}에서 가장 실용적인 접근은 먼저 ${k2}로 좁히고 최종 판단에만 ${k3}를 적용하는 구조입니다. 처음부터 모든 조건을 반영하려 하면 오히려 결정이 늦어집니다.`,
    `${a.practicalExample} 상황에서 가장 먼저 할 일은 ${withObjectPhrase(k2)} 검토하고 통과한 선택지만 ${k3} 기준으로 다시 거르는 것입니다. 이 2단계 방식이 빠른 결론을 만드는 데 효과적입니다.`,
    `${a.practicalExample}에서 ${k2}를 기준으로 삼고 ${k3}를 덧붙이면 다음에 같은 상황을 다시 설명할 때 비용이 줄어듭니다. 이 두 가지만 남겨도 충분한 경우가 많습니다.`,
  ];

  return [
    {
      q: `${withObjectPhrase(a.mainKeyword)} 처음 쓸 때 "${a.readerProblem}"이 생기는 이유는?`,
      a: q1answers[tone % 4],
    },
    {
      q: `${a.practicalExample} 상황에서 가장 먼저 할 일은?`,
      a: q2answers[tone % 4],
    },
    {
      q: `${a.mainKeyword} 결과가 마음에 들지 않으면 다시 정해도 되나요?`,
      a: `가능하지만 재시도 횟수를 미리 정해야 공정성이 유지됩니다. "${withEunNeun(k0)} 기준에서 벗어난 경우만 1회 재시도"처럼 예외 규칙을 명시해 두면 기준 없이 계속 다시 고르는 상황을 막을 수 있습니다.`,
    },
    {
      q: `${withObjectPhrase(a.mainKeyword)} 팀원 여러 명이 함께 쓸 때 주의할 점은?`,
      a: `${k3} 기준을 공유하기 전에 모든 참여자가 같은 버전의 선택지를 보고 있는지 먼저 확인해야 합니다. 공유 URL이나 문서 링크로 동일한 상태를 전달하면 혼선이 줄어듭니다.`,
    },
  ];
}

// ─── 실수 빌더 ───────────────────────────────────────────────────
function buildMistakes(a: GeneratedArticlePlan) {
  const [k0, k1, k2, k3] = [0, 1, 2, 3].map(i => keywordAt(a, i));
  const mv = mistakeVariant(a);
  const sets = [
    [
      {
        title: `목적 없이 바로 ${a.mainKeyword} 실행`,
        why: `${withObjectPhrase(k0)} 먼저 정하지 않으면 "${a.readerProblem}"이 반복됩니다. 결과가 나와도 "왜 이 결과인가"를 설명하기 어렵습니다.`,
        fix: `실행 전 한 줄로 목적을 적고 ${k0} 기준을 확인한 뒤 시작합니다. "${a.readerProblem}"을 피하려면 이 한 단계가 가장 중요합니다.`,
      },
      {
        title: `${withObjectPhrase(k1)} 지나치게 많이 추가`,
        why: `${a.practicalExample} 상황에서 선택지가 많아질수록 결과 설명이 복잡해지고 납득도가 낮아집니다.`,
        fix: `${k1}은 3~5개 이내로 압축하고, 나머지는 다음 회차 기준으로 미룹니다. 특히 ${a.practicalExample}에서는 적은 선택지가 더 빠른 결론을 만듭니다.`,
      },
      {
        title: `결과만 저장하고 ${withObjectPhrase(k2)} 남기지 않음`,
        why: `같은 상황이 다시 왔을 때 "${a.readerProblem}"을 처음부터 논의하게 됩니다.`,
        fix: `${k2}와 ${k3}을 결과와 함께 한 줄씩 기록해 두면 다음 결정 속도가 빨라집니다.`,
      },
    ],
    [
      {
        title: `${a.mainKeyword} 기준을 매번 새로 정함`,
        why: `반복 실행에서 기준이 달라지면 이전 결과와 비교가 불가능해지고, "${a.readerProblem}" 상황이 계속됩니다.`,
        fix: `${k0} 기준을 한 번 정한 뒤 고정하고, 상황 변화 시에만 명시적으로 업데이트합니다.`,
      },
      {
        title: `${withObjectPhrase(k1)} 결과 공유 없이 혼자 보관`,
        why: `관련자가 결과를 모르거나 다른 버전을 갖고 있으면 실행 단계에서 충돌이 생깁니다.`,
        fix: `공유 URL이나 문서 링크로 결과를 동일하게 전달하고, 열람 시점을 기록합니다.`,
      },
      {
        title: `${a.practicalExample}에서 예외 케이스를 미리 정의하지 않음`,
        why: `${a.practicalExample} 도중 예외가 생겼을 때 즉흥으로 판단하면 공정성 시비가 생기고 "${a.readerProblem}"이 악화됩니다.`,
        fix: `"${k2}에 해당하는 경우는 제외"처럼 예외 규칙을 사전에 명시해 둡니다.`,
      },
    ],
    [
      {
        title: `${withObjectPhrase(a.mainKeyword)} 너무 복잡하게 설계`,
        why: `처음부터 모든 조건을 반영하려 하면 실행 속도가 늦어지고, "${a.readerProblem}"이 해소되지 않습니다.`,
        fix: `핵심 조건 2가지만 우선 적용하고, 나머지는 운영하면서 추가합니다.`,
      },
      {
        title: `${k3} 없이 결과만 전달`,
        why: `맥락 없이 결과만 전달하면 수신자가 이유를 모르고 재질문하거나 거부할 수 있습니다.`,
        fix: `결과 메시지에 "${k0} 기준으로 선택된 결과입니다"처럼 한 줄을 추가합니다.`,
      },
      {
        title: `${a.practicalExample}에 같은 ${a.mainKeyword} 설정을 그대로 재사용`,
        why: `목적이 다른 상황에 같은 설정을 쓰면 결과 신뢰도가 낮아지고 "${a.readerProblem}"이 재발합니다.`,
        fix: `상황이 바뀌면 ${k1}과 ${k2}를 새로 검토하고 선택지를 재설정합니다.`,
      },
    ],
    [
      {
        title: `${withObjectPhrase(k0)} 검토 없이 진행`,
        why: `${k0}가 현재 상황에 맞는지 확인하지 않으면 결과를 적용할 수 없는 경우가 생깁니다.`,
        fix: `진행 전 "${k0}는 이번 결정에 직접 영향을 주는가?"를 한 번 점검합니다.`,
      },
      {
        title: `${a.mainKeyword} 결과를 검토 없이 즉시 확정`,
        why: `"${a.readerProblem}" 상황에서 바로 확정하면 이해관계자의 반발이 생길 수 있습니다.`,
        fix: `결과 공지 전 ${k2} 단계에서 한 번 검토 기회를 두면 납득도가 높아집니다. 특히 ${a.practicalExample}에서는 이 단계가 중요합니다.`,
      },
      {
        title: `${k1}와 ${k3}를 동시에 바꿈`,
        why: `두 가지를 한꺼번에 바꾸면 결과가 달라진 원인을 파악하기 어렵습니다.`,
        fix: `변경은 한 번에 한 가지씩 적용하고, 결과 차이를 확인한 뒤 다음 변경을 진행합니다.`,
      },
    ],
  ];
  return sets[mv];
}

// ─── 팁 빌더 ─────────────────────────────────────────────────────
function buildPracticalTips(a: GeneratedArticlePlan) {
  const [k0, k1, k2, k3] = [0, 1, 2, 3].map(i => keywordAt(a, i));
  const tv = tipVariant(a);
  const sets = [
    [
      {
        title: `${a.mainKeyword}은 짧게 시작할수록 지속됩니다`,
        body: `처음부터 완벽한 ${k0} 기준을 세우려 하면 실행이 미뤄지고 "${a.readerProblem}"이 해소되지 않습니다. ${a.practicalExample}에서는 선택지 3개짜리 간단한 버전으로 먼저 돌려보고 피드백을 반영해 조금씩 확장하는 방식이 실제로 오래 씁니다.`,
      },
      {
        title: `${k2} 결과는 공유 가능한 형태로 남기세요`,
        body: `결과를 자신만 알고 있으면 다음 회차에 같은 논의가 반복됩니다. ${a.practicalExample} 상황에서 URL 공유나 짧은 메모로 ${k3}까지 함께 남기면 팀 전체의 결정 속도가 빨라집니다.`,
      },
    ],
    [
      {
        title: `${withObjectPhrase(k0)} 먼저 고정하면 실행이 빨라집니다`,
        body: `매번 ${k0} 기준을 다시 논의하면 정작 ${a.mainKeyword} 실행보다 기준 정하기에 시간이 더 걸립니다. "${a.readerProblem}"을 막으려면 한 번 정한 기준은 명시적인 재검토 전까지 유지합니다.`,
      },
      {
        title: `${a.practicalExample}에서 ${k1}는 3개 이하로 유지`,
        body: `${a.practicalExample} 상황에서 선택지가 많아질수록 결과 설명이 복잡해집니다. 7개 이상이라면 ${k2} 기준으로 먼저 걸러내고 나머지만 최종 결정에 사용하세요.`,
      },
    ],
    [
      {
        title: `실행 전 5초 점검으로 "${a.readerProblem}"을 막을 수 있습니다`,
        body: `"선택지가 맞는가?", "${k0}는 현재 상황에 적합한가?" 이 두 가지만 빠르게 확인해도 대부분의 실행 오류를 방지할 수 있습니다. ${a.practicalExample}에서 특히 효과적인 방법입니다.`,
      },
      {
        title: `${k3}는 결과와 함께 한 줄로 기록하세요`,
        body: `나중에 같은 상황이 왔을 때 이전 결정의 이유를 설명해야 하는 경우가 생깁니다. "${k2} 기준, ${k3} 적용"처럼 짧게라도 남겨두면 다음 결정이 훨씬 빨라집니다.`,
      },
    ],
    [
      {
        title: `반복 사용이라면 ${withObjectPhrase(k1)} 템플릿화하세요`,
        body: `같은 ${a.mainKeyword} 상황이 자주 반복된다면 ${k1}과 ${k0}를 세트로 저장해두고 재사용합니다. 매번 처음부터 설정하는 시간을 줄이고 결과 일관성도 높아집니다. 특히 ${a.practicalExample}처럼 정기적으로 반복되는 경우에 효과적입니다.`,
      },
      {
        title: `"${a.readerProblem}"은 절차 공개로 줄일 수 있습니다`,
        body: `이의가 자주 생긴다면 ${k0} 기준을 참여자에게 미리 공개하세요. 결과보다 과정이 투명하면 납득도가 크게 올라갑니다. ${a.practicalExample}에서 이 방법을 쓰면 불필요한 재논의가 줄어듭니다.`,
      },
    ],
  ];
  return sets[tv];
}

// ─── 컨텐츠 타입별 섹션 ──────────────────────────────────────────
function TypeSpecificSection({ article: a }: { article: GeneratedArticlePlan }) {
  const [k0, k1, k2, k3] = [0, 1, 2, 3].map(i => keywordAt(a, i));

  if (a.contentType === "Checklist") {
    return (
      <>
        <h2>{a.mainKeyword} 체크리스트: 단계별로 나누면 빠집니다</h2>
        <p>체크리스트를 한꺼번에 보면 빠뜨리기 쉽습니다. 준비·진행·공유 세 단계로 나눠 각 단계에서 하나씩 확인하면 누락이 줄어듭니다.</p>
        <div className="grid gap-3 md:grid-cols-3">
          {([
            ["준비 단계", `${k0} 기준을 먼저 정하고, 선택지를 3~7개로 압축합니다. 예외 조건이 있다면 이 단계에서 명시합니다.`, "border-cyan-200 bg-cyan-50"],
            ["진행 단계", `${k1} 기준에 따라 실행하고, 예기치 못한 상황이 생기면 즉흥 수정보다 다음 회차 규칙 반영으로 처리합니다.`, "border-amber-200 bg-amber-50"],
            ["공유 단계", `${withObjectPhrase(k3)} 결과와 함께 짧게 남깁니다. 공유 URL이나 캡처 한 장으로도 충분합니다.`, "border-cyan-200 bg-cyan-50"],
          ] as [string, string, string][]).map(([phase, text, cls]) => (
            <div key={phase} className={`rounded-lg border p-4 ${cls}`}>
              <p className="font-semibold text-gray-900">{phase}</p>
              <p className="mt-2 text-sm text-gray-900">{text}</p>
            </div>
          ))}
        </div>
      </>
    );
  }

  if (a.contentType === "Comparison") {
    return (
      <>
        <h2>{withObjectPhrase(a.mainKeyword)} 감으로 고를 때와 기준으로 고를 때 차이</h2>
        <p>두 방식의 결과 자체는 비슷하게 보일 수 있지만, 결과를 설명하는 비용과 재사용 가능성이 크게 다릅니다.</p>
        <div className="overflow-x-auto">
          <table>
            <thead>
              <tr>
                <th>방식</th>
                <th>장점</th>
                <th>주의점</th>
                <th>적합한 상황</th>
              </tr>
            </thead>
            <tbody>
              {[
                ["즉흥 선택", "빠르게 끝납니다", `"${a.readerProblem}"이 반복될 수 있습니다`, "결과 설명이 불필요한 개인 결정"],
                [`${k0} 기준 선택`, `${withObjectPhrase(k1)} 설명하기 쉽습니다`, "처음 한 번 기준을 적어야 합니다", "여러 사람이 관여하는 결정"],
                ["도구 사용", `${k3}까지 자동으로 남기기 쉽습니다`, "입력값 정리가 먼저 필요합니다", "반복 실행·공정성이 중요한 결정"],
              ].map((row, i) => (
                <tr key={i}>
                  {row.map((cell, j) => <td key={j}>{cell}</td>)}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </>
    );
  }

  if (a.contentType === "FAQ") {
    return (
      <>
        <h2>{a.mainKeyword}: 자주 생기는 의문 3가지</h2>
        <p>{k0}, {k1}, {withObjectPhrase(k2)} 질문 단위로 나누면 검색 의도와 본문 구조가 자연스럽게 맞아집니다.</p>
        <div className="space-y-3">
          {([
            [`${withObjectPhrase(k0)} 언제 다시 검토해야 하나요?`, `상황이 바뀌거나 참여자 구성이 달라질 때마다 ${k0}를 재확인합니다. 기준이 오래되면 현실과 어긋나는 결과가 나올 수 있습니다.`, "border-cyan-200 bg-cyan-50"],
            [`${withObjectPhrase(k1)} 팀 전체가 공유하는 방법은?`, `공유 URL이나 짧은 문서 링크로 동일한 ${k1}를 전달합니다. 버전이 달라지면 결과도 달라지므로 최신본 URL을 단일 링크로 관리합니다.`, "border-amber-200 bg-amber-50"],
            [`${k2}와 ${k3} 중 먼저 정해야 하는 것은?`, `${k2}를 먼저 정하면 ${k3}를 좁히기 쉬워집니다. 반대 순서로 가면 기준이 흔들려 결과를 설명할 때 어려움이 생깁니다.`, "border-cyan-200 bg-cyan-50"],
          ] as [string, string, string][]).map(([q, ans, cls], idx) => (
            <div key={idx} className={`rounded-lg border p-4 ${cls}`}>
              <p className="font-semibold text-gray-900">Q{idx + 1}. {q}</p>
              <p className="mt-2 text-sm text-gray-900">A. {ans}</p>
            </div>
          ))}
        </div>
      </>
    );
  }

  if (a.contentType === "Explainer") {
    return (
      <>
        <h2>{withObjectPhrase(a.mainKeyword)} 쉽게 이해하는 세 가지 기준</h2>
        <p>{withEunNeun(a.mainKeyword)} 결과만 보면 단순해 보이지만 실제로는 {k0}, {k1}, {withEunNeun(k2)} 함께 움직입니다. 이 세 가지를 분리해서 보면 같은 결과라도 왜 그렇게 판단했는지 설명하기 쉬워집니다.</p>
        <div className="grid gap-3 md:grid-cols-3">
          {([
            [k0, "결정의 방향을 정합니다", `${withEunNeun(k0)} 바뀌면 선택지 구성 자체가 달라질 수 있습니다.`, "border-cyan-200 bg-cyan-50"],
            [k1, "실행 범위를 정합니다", `${k1}이 넓으면 결과 해석이 어렵고, 좁으면 적용이 빠릅니다.`, "border-amber-200 bg-amber-50"],
            [k2, "결과의 신뢰도를 높입니다", `${k2}가 명확할수록 참여자가 결과를 받아들이기 쉽습니다.`, "border-cyan-200 bg-cyan-50"],
          ] as [string, string, string, string][]).map(([label, role, desc, cls]) => (
            <div key={label} className={`rounded-lg border p-4 ${cls}`}>
              <p className="text-xs font-semibold uppercase tracking-wider text-gray-600">{role}</p>
              <p className="mt-1 font-bold text-gray-900">{label}</p>
              <p className="mt-2 text-sm text-gray-900">{desc}</p>
            </div>
          ))}
        </div>
      </>
    );
  }

  // How-to (default)
  return (
    <>
      <h2>{a.mainKeyword} 실행 흐름: 단계마다 멈추지 않는 법</h2>
      <p>{withObjectPhrase(k0)} 정하고, {withObjectPhrase(k1)} 확인하고, {k2}로 실행한 뒤 {withObjectPhrase(k3)} 남기는 순서로 진행하면 어느 단계에서 막혀도 어디서 다시 시작할지 알 수 있습니다.</p>
      <div className="rounded-lg border border-cyan-200 bg-cyan-50 p-5">
        <p className="font-semibold text-cyan-900">빠른 실행 요약</p>
        <ol className="mt-3 space-y-2 pl-5 list-decimal text-sm text-gray-800">
          <li>{withObjectPhrase(k0)} 한 줄로 정합니다.</li>
          <li>선택지를 {k1} 기준으로 5개 이내로 줄입니다.</li>
          <li>{k2}로 최종 실행하고 결과를 확인합니다.</li>
          <li>결과와 함께 {k3}를 짧게 남깁니다.</li>
        </ol>
      </div>
    </>
  );
}

// ─── 실전 사례 섹션 ──────────────────────────────────────────────
function PracticalExampleSection({ article: a }: { article: GeneratedArticlePlan }) {
  const variant = articleVariant(a);

  // 6가지 variant별 3개 서브 시나리오
  const scenarioSets: [string, string, string, string, string, string][] = [
    [
      "처음 시작하는 경우",
      `${a.practicalExample}에 ${a.mainKeyword}를 처음 적용할 때는 선택지를 3개로 시작합니다. 작게 시작해야 "${a.readerProblem}" 없이 첫 결과를 확인할 수 있습니다.`,
      "여러 사람이 함께하는 경우",
      `둘 이상이 함께 ${a.mainKeyword}를 쓸 때 "${a.readerProblem}"을 피하려면 결정 기준을 미리 공개합니다. ${a.practicalExample} 상황에서 모두가 같은 기준을 볼 수 있어야 합니다.`,
      "결과를 기록해야 하는 경우",
      `${a.practicalExample} 후 결과를 문서로 남길 때는 결론만 기록하지 말고 왜 그 결론에 이르렀는지도 한 줄로 덧붙입니다. 다음에 같은 상황이 올 때 논의 비용이 줄어듭니다.`,
    ],
    [
      "빠른 결정이 필요한 경우",
      `시간이 촉박할 때 ${a.practicalExample}에서 ${a.mainKeyword}를 써야 한다면 기준 2가지만 먼저 정합니다. "${a.readerProblem}"을 막으면서도 빠른 결론이 가능합니다.`,
      "반복 운영하는 경우",
      `${a.practicalExample}처럼 정기적으로 반복되는 상황에서 ${a.mainKeyword}를 쓸 때는 첫 회차 기준을 템플릿으로 저장합니다. 매번 처음부터 시작하는 수고가 줄어듭니다.`,
      "결과를 공유해야 하는 경우",
      `${a.practicalExample} 결과를 외부에 공유할 때는 결론과 함께 적용한 기준을 짧게 첨부합니다. "${a.readerProblem}"에 대한 의문을 사전에 차단할 수 있습니다.`,
    ],
    [
      "기준이 불명확한 경우",
      `${a.practicalExample}에서 어떤 기준을 써야 할지 모를 때는 "${a.readerProblem}"이 생기는 상황을 먼저 정의합니다. 그 상황을 막는 기준 하나만 잡아도 시작이 됩니다.`,
      "이해관계자가 많은 경우",
      `${a.practicalExample}에 여러 이해관계자가 있다면 ${a.mainKeyword} 기준을 공개하는 것이 먼저입니다. "${a.readerProblem}"은 기준이 숨겨져 있을 때 더 자주 발생합니다.`,
      "처음과 다른 결과가 나온 경우",
      `기대와 다른 결과가 나왔을 때는 즉시 다시 하기보다 ${a.practicalExample} 상황이 달라진 것인지 먼저 확인합니다. 기준을 조정하는 것과 처음부터 다시 하는 것은 다릅니다.`,
    ],
    [
      "혼자 결정해야 하는 경우",
      `${a.practicalExample}에서 혼자 ${a.mainKeyword}를 써야 한다면 기준을 별도로 적어두지 않아도 됩니다. 하지만 나중에 설명이 필요해질 수 있으므로 결과만이라도 메모해 둡니다.`,
      "팀 간 합의가 필요한 경우",
      `팀 간 ${a.mainKeyword} 합의가 필요한 ${a.practicalExample} 상황에서는 기준 정하기를 먼저 안건으로 올립니다. "${a.readerProblem}"의 대부분은 기준 합의 없이 결과만 공유해서 생깁니다.`,
      "결과 이의가 생긴 경우",
      `${a.practicalExample}에서 결과에 이의가 생겼다면 기준을 소급해서 바꾸는 것보다 다음 회차 규칙을 수정합니다. 이미 나온 결과는 적용한 기준 안에서 해석합니다.`,
    ],
    [
      "긴급 상황에서 쓰는 경우",
      `긴급한 ${a.practicalExample} 상황에서 ${a.mainKeyword}를 빠르게 써야 한다면 기준 1가지만 정하고 실행합니다. "${a.readerProblem}"보다 속도가 우선일 때는 단순화가 최선입니다.`,
      "정기 검토가 필요한 경우",
      `${a.practicalExample}을 정기적으로 검토할 때는 이전 ${a.mainKeyword} 기준이 여전히 유효한지 함께 확인합니다. 상황이 바뀌었는데 기준이 그대로면 "${a.readerProblem}"이 다시 생깁니다.`,
      "처음 도구를 도입하는 경우",
      `${a.practicalExample}에 ${a.mainKeyword} 도구를 처음 도입할 때는 기존 방식과 병행 운영합니다. 한꺼번에 바꾸면 어느 쪽에서 문제가 생긴 건지 파악하기 어렵습니다.`,
    ],
    [
      "결과 일관성이 중요한 경우",
      `${a.practicalExample}에서 매번 같은 결과를 유지해야 한다면 ${a.mainKeyword} 기준을 변경 이력과 함께 관리합니다. "${a.readerProblem}"은 기준이 언제 어떻게 바뀌었는지 모를 때 생깁니다.`,
      "비전문가와 함께 쓰는 경우",
      `${a.mainKeyword}를 처음 접하는 사람과 함께 ${a.practicalExample}을 진행할 때는 기준을 평이한 말로 먼저 설명합니다. 용어보다 "왜 이렇게 하는가"를 이해시키는 것이 먼저입니다.`,
      "자동화와 연결하는 경우",
      `${a.practicalExample}에 ${a.mainKeyword}를 자동화와 연결할 때는 기준 변경이 자동화 결과에 어떤 영향을 미치는지 먼저 확인합니다. 기준과 자동화가 어긋나면 "${a.readerProblem}"이 자동으로 반복됩니다.`,
    ],
  ];

  const [title1, body1, title2, body2, title3, body3] = scenarioSets[variant];

  return (
    <>
      <h2>{a.practicalExample}: 상황별 적용 방법</h2>
      <p>{a.practicalExample}은 {withEunNeun(a.mainKeyword)} 실제로 써야 하는 대표적인 상황입니다. 아래 세 가지 세부 상황에서 어떻게 적용할지 확인하세요.</p>
      <div className="grid gap-3 md:grid-cols-3">
        <div className="rounded-lg border border-cyan-200 bg-cyan-50 p-4">
          <p className="font-semibold text-cyan-900">{title1}</p>
          <p className="mt-2 text-sm text-gray-800">{body1}</p>
        </div>
        <div className="rounded-lg border border-amber-200 bg-amber-50 p-4">
          <p className="font-semibold text-amber-900">{title2}</p>
          <p className="mt-2 text-sm text-gray-800">{body2}</p>
        </div>
        <div className="rounded-lg border border-cyan-200 bg-cyan-50 p-4">
          <p className="font-semibold text-cyan-900">{title3}</p>
          <p className="mt-2 text-sm text-gray-800">{body3}</p>
        </div>
      </div>
    </>
  );
}

// ─── 흔한 실수 섹션 ───────────────────────────────────────────────
function MistakesSection({ article: a }: { article: GeneratedArticlePlan }) {
  const mistakes = buildMistakes(a);
  return (
    <>
      <h2>{a.mainKeyword}에서 자주 하는 실수 3가지</h2>
      <p>같은 실수를 반복하지 않으려면 결과가 나쁜 이유를 먼저 알아야 합니다. 아래는 {a.practicalExample} 상황에서 실제로 자주 발생하는 패턴입니다.</p>
      <div className="space-y-3">
        {mistakes.map((m, i) => (
          <div key={i} className="flex gap-4 rounded-lg border border-amber-200 bg-amber-50 p-4">
            <div className="flex-shrink-0">
              <span className="flex h-7 w-7 items-center justify-center rounded-full bg-amber-500 text-sm font-bold text-white">{i + 1}</span>
            </div>
            <div>
              <p className="font-semibold text-gray-900">{m.title}</p>
              <p className="mt-1 text-sm text-gray-800"><span className="font-medium text-amber-700">왜 문제인가:</span> {m.why}</p>
              <p className="mt-1 text-sm text-gray-800"><span className="font-medium text-cyan-700">해결 방법:</span> {m.fix}</p>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}

const TIP_COLORS = [
  "border-cyan-200 bg-cyan-50",
  "border-amber-200 bg-amber-50",
] as const;

// ─── 실전 팁 섹션 ─────────────────────────────────────────────────
function PracticalTipsSection({ article: a }: { article: GeneratedArticlePlan }) {
  const tips = buildPracticalTips(a);
  return (
    <>
      <h2>실전 팁: {a.mainKeyword}를 더 잘 쓰는 방법</h2>
      <div className="grid gap-4 md:grid-cols-2">
        {tips.map((tip, i) => (
          <div key={tip.title} className={`rounded-lg border p-4 ${TIP_COLORS[i % TIP_COLORS.length]}`}>
            <p className="font-semibold text-gray-900">{tip.title}</p>
            <p className="mt-2 text-sm text-gray-900">{tip.body}</p>
          </div>
        ))}
      </div>
    </>
  );
}

// ─── 상황별 섹션 ─────────────────────────────────────────────────
function ContextSection({ article: a }: { article: GeneratedArticlePlan }) {
  const variant = articleVariant(a);
  const [k0, k1, k2, k3] = [0, 1, 2, 3].map(i => keywordAt(a, i));
  const contents: [string, string][] = [
    [`${withObjectPhrase(a.mainKeyword)} 빠르게 점검하는 관점`, `가장 먼저 볼 것은 결과의 화려함이 아니라 독자가 바로 따라 할 수 있는지입니다. ${withWaGwa(k0)} ${withIga(k1)} 본문 안에서 자연스럽게 이어지면 검색 의도와 실행 흐름이 같이 살아납니다.`],
    [`${withObjectPhrase(a.mainKeyword)} 실제 상황에 맞추는 방법`, `${a.practicalExample}에는 정답 하나보다 납득 가능한 절차가 더 중요합니다. 먼저 ${withObjectPhrase(k0)} 확인하고, 이해관계자가 헷갈릴 수 있는 ${withObjectPhrase(k1)} 짧게 적어두면 결과 설명이 쉬워집니다.`],
    [`${withObjectPhrase(a.mainKeyword)} 문서로 남길 때 필요한 것`, `실행 후에는 결과만 저장하지 말고 왜 그 방식으로 정했는지 함께 남기는 편이 좋습니다. ${withWaGwa(k2)} ${withObjectPhrase(k3)} 같이 적으면 나중에 같은 조건을 다시 확인할 때 설명 비용이 줄어듭니다.`],
    [`${a.mainKeyword}에서 먼저 버릴 조건`, `모든 조건을 한 번에 반영하려고 하면 오히려 판단이 느려집니다. 이번 결정에 직접 영향을 주지 않는 후보를 덜어내고 ${withWaGwa(k0)} ${k2}만 먼저 남기면 실행 속도가 빨라집니다.`],
    [`${withObjectPhrase(a.mainKeyword)} 반복 운영할 때의 기준`, `한 번 쓰고 끝나는 기준과 매번 다시 쓰는 기준은 다르게 설계해야 합니다. 반복 운영에서는 ${withObjectPhrase(k1)} 고정하고 ${k3}만 상황에 따라 바꾸는 방식이 관리하기 쉽습니다.`],
    [`${a.mainKeyword}를 처음 팀에 도입할 때`, `새로운 결정 방식을 팀에 도입할 때는 결과의 정확성보다 절차의 투명성을 먼저 강조합니다. "${k0} 기준으로 정했고, ${k2}는 이렇게 처리했다"는 식으로 ${withObjectPhrase(k3)} 공개하면 처음 쓰는 사람도 이해하고 따라올 수 있습니다.`],
  ];
  const [heading, body] = contents[variant];
  return (
    <>
      <h2>{heading}</h2>
      <p>{body}</p>
    </>
  );
}

// ─── H2 헤딩 변형 세트 (키워드 + 다양성) ─────────────────────────
function h2When(a: GeneratedArticlePlan) {
  const [k0] = [0].map(i => keywordAt(a, i));
  const sets = [
    `${a.mainKeyword}가 필요한 순간`,
    `${a.mainKeyword}와 ${k0}: 언제 꺼내야 할까?`,
    `${a.practicalExample}에서 ${a.mainKeyword}가 빛나는 이유`,
    `${a.mainKeyword}를 쓰면 달라지는 것`,
    `${k0}와 함께 보는 ${a.mainKeyword} 활용 시점`,
    `${a.mainKeyword}가 해결하는 진짜 문제`,
  ];
  return sets[toneVariant(a) % sets.length];
}

function h2Criteria(a: GeneratedArticlePlan) {
  const [k0, , k2] = [0, 1, 2].map(i => keywordAt(a, i));
  const sets = [
    `${a.mainKeyword}: ${k0}와 ${k2}로 기준 잡기`,
    `${a.mainKeyword} 결정 기준 — 놓치면 안 되는 핵심`,
    `${k0}부터 시작하는 ${a.mainKeyword} 기준 설계`,
    `${a.mainKeyword}를 제대로 쓰기 위한 판단 기준`,
    `${k2} 중심으로 보는 ${a.mainKeyword} 기준`,
    `${a.mainKeyword} 기준, ${k0}와 ${k2} 두 가지만 기억하세요`,
  ];
  return sets[mistakeVariant(a) % sets.length];
}

function h2Steps(a: GeneratedArticlePlan) {
  const [, k1] = [0, 1].map(i => keywordAt(a, i));
  const sets = [
    `${a.mainKeyword} 단계별 실행 방법`,
    `${k1}부터 시작하는 ${a.mainKeyword} 실전 흐름`,
    `${a.mainKeyword} 실행 — 막히지 않는 순서`,
    `${a.practicalExample}: ${a.mainKeyword} 적용 절차`,
    `${a.mainKeyword}를 빠르게 끝내는 5단계`,
    `${k1} 기준으로 정리하는 ${a.mainKeyword} 실행순서`,
  ];
  return sets[tipVariant(a) % sets.length];
}

function h2Oversight(a: GeneratedArticlePlan) {
  const [k0] = [0].map(i => keywordAt(a, i));
  const sets = [
    `${a.mainKeyword}에서 자주 빠뜨리는 것들`,
    `${k0}를 놓치면 생기는 문제`,
    `${a.mainKeyword} 운영 중 가장 흔한 실수`,
    `${a.practicalExample}에서 꼭 챙겨야 할 체크포인트`,
    `${a.mainKeyword}: 처음 쓸 때 빠뜨리기 쉬운 항목`,
    `${k0}와 ${a.mainKeyword}, 함께 챙겨야 완성됩니다`,
  ];
  return sets[articleVariant(a) % sets.length];
}

// ─── 메인 아티클 컴포넌트 ─────────────────────────────────────────
function GeneratedArticle({ article: a }: { article: GeneratedArticlePlan }) {
  const faq = buildFaq(a);
  const tone = toneVariant(a);
  const [k0, k1, k2, k3] = [0, 1, 2, 3].map(i => keywordAt(a, i));

  // 도입부 8가지 변형 — readerProblem + practicalExample 기반
  const opening = [
    `${a.readerProblem}. 이런 상황에서 ${withEunNeun(a.mainKeyword)} 가장 효과적인 해결 도구입니다. ${k0}와 ${k1}을 먼저 정리하면 실행이 훨씬 단순해집니다.`,
    `${a.practicalExample}에서 "${a.readerProblem}"이 반복된다면, 기준이 아직 없다는 신호입니다. ${withObjectPhrase(a.mainKeyword)} 다룰 때는 빠른 결론보다 나중에도 설명 가능한 절차가 훨씬 중요합니다.`,
    `"${a.readerProblem}" — ${a.practicalExample} 상황에서 이 고민이 계속된다면, ${k0}와 ${k1} 두 가지만 먼저 확정해도 실행 중 혼선의 대부분을 막을 수 있습니다.`,
    `${a.practicalExample}에서 ${withEunNeun(a.mainKeyword)} 한 번만 정리해 두면 이후 선택과 공유 과정이 훨씬 간단해집니다. "${a.readerProblem}"이 반복된다면 ${k0} 기준이 없어서입니다.`,
    `"${a.readerProblem}"이 반복된다면 ${withEunNeun(a.mainKeyword)} 아직 구체적인 기준이 없는 겁니다. ${k0}와 ${k1}을 한 번만 명확히 해두면 이후 결정은 눈에 띄게 빨라집니다.`,
    `${a.practicalExample} 상황에서 ${withEunNeun(a.mainKeyword)} 가장 자주 꺼내는 고민 중 하나입니다. "${a.readerProblem}"을 해결할 절차를 미리 만들어 두면, 매번 처음부터 다시 시작할 필요가 없어집니다.`,
    `${a.mainKeyword}를 능숙하게 쓰는 사람과 그렇지 않은 사람의 차이는 재능이 아닙니다. "${a.readerProblem}"을 미리 막는 ${k0} 기준이 있는지 없는지의 차이입니다. ${a.practicalExample}에서 한 줄짜리 기준만 있어도 실행 속도가 크게 달라집니다.`,
    `${a.practicalExample}에서 ${withEunNeun(a.mainKeyword)} 어렵게 느껴지는 이유는 대부분 "${a.readerProblem}" 때문입니다. ${k0}와 ${k2}만 먼저 정하면, 나머지는 자연스럽게 따라옵니다.`,
  ][tone];

  const summaryLast = [
    "발행·공유·업무 적용 전에는 체크리스트로 한 번 더 검토하는 편이 안전합니다.",
    "결과보다 절차를 함께 남기면 다음번 판단 비용이 크게 줄어듭니다.",
    "내부 링크와 공식 출처를 같이 두면 독자가 읽은 뒤 바로 실행할 수 있습니다.",
    "기준을 짧게 공개하면 참여자나 독자가 결과를 받아들이기 훨씬 쉬워집니다.",
    `${k0} 하나만 고정해도 전체 실행 흐름이 안정됩니다.`,
    `${a.practicalExample}에서 이 순서를 지키면 같은 실수를 반복하지 않습니다.`,
    "처음에는 단순하게, 반복하면서 조금씩 정교하게 만들어가는 방식이 가장 오래 지속됩니다.",
    `${k2}와 ${k3}을 함께 남기면 다음 결정의 출발점이 됩니다.`,
  ][tone];

  const checklist = [
    `"${a.readerProblem}"이 생기지 않도록 ${withObjectPhrase(a.mainKeyword)} 쓰는 목적을 한 문장으로 정리하기`,
    `${k0} 기준과 예외 조건을 미리 분리해 두기`,
    `${a.practicalExample}에서 결과를 나중에 확인할 수 있는 형태로 기록하기`,
    `${k2} 단계에서 필요한 링크와 자료 미리 확인하기`,
    `결과 공유 전 ${k3} 기준을 한 줄로 덧붙이기`,
  ];

  const steps = [
    `목표를 한 줄로 적습니다 — "${a.readerProblem}"을 방지하는 것이 이번 ${a.mainKeyword}의 핵심 목적입니다.`,
    `${withObjectPhrase(k0)} 확인하고, 이번 결정에 직접 영향을 주지 않는 선택지를 제거합니다.`,
    `${a.practicalExample} 맥락에서 ${k1} 기준으로 남은 선택지의 우선순위를 정합니다. 3~5개가 적당합니다.`,
    `${a.searchIntent}에 맞는지 확인한 뒤 ${withRo(k2)} 최종 실행합니다. 예외가 생기면 즉흥 수정 대신 다음 회차에 반영합니다.`,
    `결과와 함께 ${k3}를 한 줄로 기록하고 공유합니다. 이 기록이 다음 결정의 출발점이 됩니다.`,
  ];

  return (
    <div className="space-y-8">
      {/* 배지 행 */}
      <div className="flex flex-wrap gap-2 text-xs">
        <span className="rounded-full border border-cyan-200 bg-cyan-50 px-3 py-1 text-cyan-700 font-medium">{a.category}</span>
        <span className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-slate-600">{contentTypeLabel(a.contentType)}</span>
        <span className="rounded-full border border-slate-200 bg-white px-3 py-1 text-slate-400">약 5분 읽기</span>
      </div>

      {/* 도입부 */}
      <p className="text-base leading-relaxed text-gray-900 border-l-4 border-cyan-400 pl-4">
        {opening}
      </p>

      {/* 핵심 요약 — 사이트 시안 컬러 */}
      <div className="rounded-xl border border-cyan-200 bg-cyan-50 p-5">
        <p className="font-bold text-cyan-900 mb-3">이 글의 핵심</p>
        <ul className="space-y-2">
          {[
            `"${a.readerProblem}"을 막으려면 ${withEunNeun(a.mainKeyword)} 목적과 제외 조건을 먼저 정해야 실행 중 흔들리지 않습니다.`,
            `${a.practicalExample}에서 ${a.expandedKeywords.slice(0, 2).join("과 ")}를 나눠 보면 실행 순서가 명확해집니다.`,
            summaryLast,
          ].map((item, i) => (
            <li key={i} className="flex items-start gap-2 text-sm text-cyan-900">
              <span className="mt-0.5 flex-shrink-0 font-bold text-cyan-500">✓</span>
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* 언제 필요한가 */}
      <div>
        <h2>{h2When(a)}</h2>
        <p>가장 흔한 장면은 {a.practicalExample}입니다. 이때 사람들은 빠른 결론을 원하지만, 기준이 없으면 같은 결정을 반복해서 다시 논의하게 됩니다. {withObjectPhrase(a.mainKeyword)} 별도 기준으로 분리하면 선택지, 제약, 결과를 나눠 볼 수 있어 실수가 줄어듭니다.</p>
        <p>{a.searchIntent}를 목표로 {a.practicalExample}에 접근할 때, {withWaGwa(k0)} {withIga(k1)} 함께 걸린 상황에서는 단순 추천보다 재사용 가능한 규칙이 더 중요합니다. 한 번 정한 규칙은 회의, 문서, 개인 일정, 콘텐츠 운영에도 반복해서 적용할 수 있습니다.</p>
      </div>

      <TypeSpecificSection article={a} />

      <PracticalExampleSection article={a} />

      <MistakesSection article={a} />

      <ContextSection article={a} />

      {/* 기준 테이블 */}
      <div>
        <h2>{h2Criteria(a)}</h2>
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
                <td>왜 지금 이 판단이 필요한가?</td>
                <td>{a.searchIntent}에 맞는 결과만 남깁니다</td>
              </tr>
              <tr>
                <td>범위</td>
                <td>어디까지 단순화할 수 있나?</td>
                <td>{withObjectPhrase(k2)} 기준으로 제외 조건을 먼저 정합니다</td>
              </tr>
              <tr>
                <td>검증</td>
                <td>결과가 실제로 쓸 만한가?</td>
                <td>{k3}와 함께 기록·비교·재사용 가능성을 함께 봅니다</td>
              </tr>
              <tr>
                <td>예외</td>
                <td>특수 케이스는 어떻게 처리하나?</td>
                <td>예외는 즉흥 처리보다 다음 회차 규칙으로 반영합니다</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* 실행 순서 */}
      <div>
        <h2>{h2Steps(a)}</h2>
        <div className="space-y-3">
          {steps.map((text, idx) => (
            <div key={idx} className="flex items-start gap-4 rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
              <div className="flex-shrink-0 flex h-7 w-7 items-center justify-center rounded-full bg-cyan-600 text-sm font-bold text-white">
                {idx + 1}
              </div>
              <p className="pt-0.5 text-sm text-gray-900">{text}</p>
            </div>
          ))}
        </div>
        <p className="mt-3 text-sm text-gray-600 italic">
          이 방식은 결론을 억지로 밀어붙이기 위한 요령이 아닙니다. 같은 문제를 다시 만났을 때 처음부터 고민하지 않기 위한 운영 방식입니다.
        </p>
      </div>

      <PracticalTipsSection article={a} />

      {/* 놓치기 쉬운 점 */}
      <div>
        <h2>{h2Oversight(a)}</h2>
        <p>{contentTypeLabel(a.contentType)} 유형에서는 결과보다 과정 설명이 더 중요해질 때가 많습니다. {a.practicalExample}에는 모두가 같은 기준으로 판단했다는 신호가 필요합니다.</p>
        <ul>
          <li>결과 화면이나 공유 문구에는 {k3} 기준을 짧게 남깁니다.</li>
          <li>반복해서 쓰는 상황이라면 같은 입력 형식과 같은 순서를 유지합니다.</li>
          <li>예외가 생기면 결과를 바꾸기보다 다음 회차 규칙에 반영합니다.</li>
          <li>{k0}와 {k2}는 한 번 정하면 쉽게 바꾸지 않는 것이 기록 신뢰도에 유리합니다.</li>
        </ul>
      </div>

      {/* 체크리스트 — 앰버(실행 전 점검) */}
      <div>
        <h2>실행 전 체크리스트: {a.mainKeyword}</h2>
        <div className="space-y-2">
          {checklist.map((item, i) => (
            <div key={i} className="flex items-center gap-3 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3">
              <span className="flex-shrink-0 text-lg text-amber-500" aria-hidden="true">□</span>
              <span className="text-sm text-gray-900">{item}</span>
            </div>
          ))}
        </div>
      </div>

      {/* 내부 링크 */}
      <div>
        <h2>{a.mainKeyword}와 함께 쓰는 SpinFlow 도구</h2>
        <p>아래 도구는 {withWaGwa(a.mainKeyword)} 직접 연결되는 흐름입니다. 글을 읽은 뒤 바로 실행해 보세요.</p>
        <ul>
          {a.internalLinks.map((link) => (
            <li key={link.path}>
              <Link to={link.path}>{link.label}</Link>
            </li>
          ))}
        </ul>
      </div>

      {/* 출처 */}
      <div>
        <h2>{a.mainKeyword} 근거와 참고 자료</h2>
        <p>
          공식 문서와 공개 자료를 확인할 때는 최신 날짜, 적용 범위, 예외 조건을 함께 봐야 합니다. 이 글은{" "}
          <a href={a.primarySourceUrl} target="_blank" rel="noreferrer">{a.primarySourceName}</a>{" "}
          자료를 기본 참고 출처로 삼았습니다.
        </p>
      </div>

      {/* 마무리 — 사이트 시안 컬러 CTA */}
      <div className="rounded-xl border border-cyan-300 bg-gradient-to-br from-cyan-50 to-white p-6">
        <p className="font-bold text-cyan-900 mb-2">핵심 한 줄 정리</p>
        <p className="text-sm text-cyan-800 mb-4">
          {withEunNeun(a.mainKeyword)} {k0}와 {k2}를 먼저 정하고, 결과와 함께 {withObjectPhrase(k3)} 남기면 다음 결정이 훨씬 빨라집니다.
        </p>
        <Link
          to={a.internalLinks[0]?.path ?? "/"}
          className="inline-block rounded-full bg-cyan-600 px-5 py-2 text-sm font-bold text-white hover:bg-cyan-700 transition-colors"
        >
          {a.internalLinks[0]?.label ?? "SpinFlow 도구 바로 쓰기"} →
        </Link>
      </div>

      {/* FAQ — 2가지 컬러로 교대 */}
      <div>
        <h2>{a.mainKeyword} 자주 묻는 질문</h2>
        <div className="space-y-3">
          {faq.map((item, index) => (
            <div key={item.q} className={`rounded-lg border p-4 ${index % 2 === 0 ? "border-cyan-200 bg-cyan-50" : "border-amber-200 bg-amber-50"}`}>
              <p className="font-semibold text-gray-900">Q{index + 1}. {item.q}</p>
              <p className="mt-2 text-sm text-gray-700">A. {item.a}</p>
            </div>
          ))}
        </div>
      </div>

      {/* 키워드 푸터 */}
      <div className="border-t border-gray-200 pt-4">
        <p className="text-xs text-gray-400">
          <span className="font-medium text-gray-500">관련 키워드:</span> {keywordText(a)}
        </p>
      </div>
    </div>
  );
}

// ─── 빌더 & 로더 ─────────────────────────────────────────────────
function buildGeneratedBlogPost(article: GeneratedArticlePlan): BlogPost {
  return {
    slug: article.slug,
    title: article.title,
    description: article.description,
    date: article.date,
    publishAt: article.publishAt,
    tags: article.tags,
    thumbnail: article.thumbnail,
    qualityScore: article.qualityScore,
    content: article.body
      ? <div className="written-article prose prose-slate prose-lg max-w-none" dangerouslySetInnerHTML={{ __html: article.body }} />
      : <GeneratedArticle article={article} />,
  };
}

export async function loadGeneratedBlogPost(slug: string): Promise<BlogPost | undefined> {
  const chunkFile = ARTICLE_CHUNK_BY_SLUG[slug];
  if (!chunkFile) return undefined;
  const loadChunk = ARTICLE_CHUNKS[`./generated-content-chunks/${chunkFile}`];
  if (!loadChunk) return undefined;
  const articles = await loadChunk();
  const article = articles.find((item) => item.slug === slug);
  return article ? buildGeneratedBlogPost(article) : undefined;
}
