export interface Template {
    id: string;
    name: string;
    icon: string;
    items: string[];
}

export const TEMPLATES: Template[] = [
    {
        id: 'lunch',
        name: '점심 메뉴',
        icon: '🍔',
        items: [
            '김치찌개', '된장찌개', '제육볶음', '돈까스', '짜장면',
            '짬뽕', '햄버거', '샌드위치', '국밥', '칼국수',
            '초밥', '떡볶이', '비빔밥', '파스타', '피자'
        ]
    },
    {
        id: 'lotto',
        name: '로또 번호',
        icon: '🎰',
        items: Array.from({ length: 45 }, (_, i) => (i + 1).toString())
    },
    {
        id: 'drinking',
        name: '술자리 게임',
        icon: '🍺',
        items: [
            '한 잔 마시기', '러브샷', '흑기사', '노래 부르기',
            '진실게임', '옆 사람 안아주기', '건배사 하기', '물 한 잔 마시기'
        ]
    },
    {
        id: 'chores',
        name: '집안일 당번',
        icon: '🧹',
        items: ['설거지', '빨래', '청소기 돌리기', '쓰레기 버리기', '요리하기', '화장실 청소']
    },
    {
        id: 'truth-dare',
        name: '진실 혹은 도전',
        icon: '🎲',
        items: ['진실', '도전']
    }
];
