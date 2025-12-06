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

export default function SpinflowStandalone() {
  return (
    <Home
      initialItems={DEFAULT_ITEMS}
      preferInitialOnFirstLoad
      disableDeepLinkPresetSync
      title="SpinFlow 룰렛 (스탠드얼론)"
      description="라우팅 이동 없이 프리셋을 바로 적용하는 스탠드얼론 SpinFlow 룰렛."
      keywords="룰렛, 스탠드얼론, 프리셋, 라우터 없이 적용, SpinFlow"
    />
  );
}

