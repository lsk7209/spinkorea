import Home from './Home';

const DEFAULT_ITEMS = [
  '한식',
  '중식',
  '일식',
  '양식',
  '분식',
  '치킨',
  '피자',
  '햄버거',
];

/**
 * 메뉴용 "룰렛돌리기" 전용 페이지.
 * - 라우터 이동 없이 프리셋을 바로 적용.
 * - 초기 프리셋을 강제로 반영(저장 상태보다 우선).
 */
export default function Roulette() {
  return (
    <Home
      initialItems={DEFAULT_ITEMS}
      preferInitialOnFirstLoad
      disableDeepLinkPresetSync
      title="룰렛돌리기 - SpinFlow"
      description="라우터 이동 없이 프리셋을 즉시 적용하는 전용 룰렛돌리기 페이지."
      keywords="룰렛돌리기, 프리셋, SpinFlow, 원판돌리기, 랜덤추첨"
    />
  );
}

