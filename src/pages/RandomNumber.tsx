import Home from './Home';
import { TEMPLATES } from '@/data/templates';

export default function RandomNumber() {
    const lottoTemplate = TEMPLATES.find(t => t.id === 'lotto');

    return (
        <Home
            initialItems={lottoTemplate?.items}
            title="랜덤 번호 추첨기 - 로또 번호 생성 | 행운의 숫자 | SpinFlow"
            description="무료 랜덤 번호 추첨기입니다. 로또 번호 생성, 경품 당첨자 추첨, 순서 정하기 등 숫자가 필요한 모든 순간에 공정하게 사용하세요. 범위 지정 가능, 중복 없는 난수 생성."
            keywords="랜덤번호추첨기, 로또번호생성기, 난수생성기, 번호뽑기, 당첨자추첨, 숫자뽑기, 행운의숫자, 로또추천, 무료추첨기, 순서정하기"
        />
    );
}
