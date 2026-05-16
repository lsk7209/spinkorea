/**
 * 600개 글 썸네일 고유화 스크립트
 * 각 글의 slug를 시드로 picsum.photos 결정론적 고유 이미지를 할당합니다.
 * picsum.photos/seed/{seed}/1600/900 → 슬러그마다 항상 동일한 고유 이미지
 */
import fs from "node:fs";
import path from "node:path";

const ROOT = process.cwd();
const CHUNK_DIR = path.join(ROOT, "src", "data", "generated-content-chunks");
const PLAN_PATH = path.join(ROOT, "src", "data", "content-plan.generated.json");

// 카테고리별 Unsplash 큐레이션 풀 (카테고리 연관성 유지)
// picsum과 혼합: 카테고리 풀이 고갈되면 slug 기반 picsum 사용
const CATEGORY_POOLS = {
  "룰렛·랜덤 결정": [
    "photo-1511193311914-0346f16efe90", // dice game board
    "photo-1606167668584-78701c57f13d", // casino
    "photo-1529156069898-49953e39b3ac", // board game group
    "photo-1553481187-be93c21490a9",    // roulette
    "photo-1596461404969-9ae70f2830c1", // game night
    "photo-1560419015-7c427e8ae5ba",    // dice closeup
    "photo-1564053489984-317bbd824340", // decision arrow
    "photo-1516450360452-9312f5e86fc7", // neon lights
    "photo-1542826438-bd32f43d626f",    // lottery
    "photo-1563089145-599997674d42",    // spinning
    "photo-1586769852836-bc069f19e1b6", // lucky charm
    "photo-1519708227418-c8fd9a32b7a2", // fun game
  ],
  "계산기·생활 유틸": [
    "photo-1450101499163-c8848c66ca85", // calculator
    "photo-1554224155-8d04cb21cd6c",    // finance numbers
    "photo-1567427017947-545c5f8d16ad", // bills money
    "photo-1460925895917-afdab827c52f", // business chart
    "photo-1586281380349-632531db7ed4", // financial planning
    "photo-1553729459-efe14ef6055d",    // financial analysis
    "photo-1576091160550-2173dba999ef", // medical calculator
    "photo-1580519542036-c47de6196ba5", // budget
    "photo-1515378791036-0648a3ef77b2", // spreadsheet
    "photo-1611532736597-de2d4265fba3", // money stack
    "photo-1559526324-4b87b5e36e44",    // percent discount
    "photo-1574958269340-fa927503f3dd", // number calculation
    "photo-1618044619888-009e412ff12a", // utility bill
    "photo-1586996292898-71f4036c4e07", // home budget
    "photo-1534951009808-766178b47a4f", // electricity meter
  ],
  "텍스트·문서 도구": [
    "photo-1455390582262-044cdead277a", // writing paper (current)
    "photo-1471107340929-a87cd0f5b5f3", // typewriter
    "photo-1468436139062-f60a71c5c892", // books stacked
    "photo-1550399105-c4db5fb85c18", // open book
    "photo-1586339949916-3e9457bef6d3", // writing notes
    "photo-1517842645767-c639042777db", // pencil notebook
    "photo-1527430253228-e93688616381", // document editing
    "photo-1579468118864-1b9ea3c0db4a", // keyboard typing
    "photo-1457369804613-52c61a468e7d", // text editing
    "photo-1503551723145-6c040742065b", // pen and paper
    "photo-1519791883288-dc8bd696e667", // office desk writing
    "photo-1512238701873-2a5738a9d4ab", // text editor
    "photo-1498049794561-7780e7231661", // creative workspace
    "photo-1532012197267-da84d127e765", // books library
    "photo-1488190211105-8b0e65b80b4e", // writing draft
    "photo-1542435503-956c469947f6", // calligraphy
    "photo-1484480974693-6ca0a78fb36b", // note taking
    "photo-1481627834876-b7833e8f5570", // old books
    "photo-1541963463532-d68292c34b19", // reading books
  ],
  "개발자 웹 도구": [
    "photo-1461749280684-dccba630e2f6", // code monitor (current)
    "photo-1518770660439-4636190af475", // circuit board
    "photo-1488590528505-98d2b5aba04b", // laptop code
    "photo-1517694712202-14dd9538aa97", // code close up
    "photo-1531297484001-80022131f5a1", // dark coding
    "photo-1487058792275-0ad4aaf24ca7", // code dark monitor
    "photo-1563206767-5b18f218e8de", // code editor
    "photo-1515879218367-8466d910aaa4", // terminal
    "photo-1550751827-4bd374c3f58b", // cybersecurity
    "photo-1558346490-a72e53ae2d4f", // smart tech
    "photo-1614064641938-3bbee52942c7", // developer tools
    "photo-1605379399642-870262d3d051", // dual monitors
    "photo-1573164713988-8665fc963095", // tech workspace
    "photo-1571171637578-41bc2dd41cd2", // programmer
    "photo-1510915361894-db8b60106cb1", // API connections
    "photo-1555066931-4365d14bab8c", // code on screen
    "photo-1593720213428-28a5b9e94613", // json data
    "photo-1629654297299-c8506221ca97", // URI web
    "photo-1542744173-8e7e53415bb0", // developer meeting
  ],
  "생산성·업무 방식": [
    "photo-1484480974693-6ca0a78fb36b", // workspace (current)
    "photo-1454165804606-c3d57bc86b40", // business meeting
    "photo-1515378960530-7c0da6231fb1", // office work
    "photo-1507003211169-0a1dd7228f2d", // professional
    "photo-1497366216548-37526070297c", // modern office
    "photo-1497366811353-6870744d04b2", // team collaboration
    "photo-1552664730-d307ca884978", // team meeting
    "photo-1611532736597-de2d4265fba3", // to-do list
    "photo-1434030216411-0b793f4b4173", // planning
    "photo-1533750516457-a7f992034fec", // laptop notes
    "photo-1522202176988-66273c2fd55f", // teamwork
    "photo-1541746972996-4e0b0f43e02a", // productivity desk
    "photo-1600880292203-757bb62b4baf", // video call work
    "photo-1517245386807-bb43f82c33c4", // brainstorm
    "photo-1498049860654-af1a5c566876", // data analysis work
    "photo-1590402494587-44b71d7772f6", // workflow
    "photo-1584438784894-089d6a62b8fa", // home office
    "photo-1513128034602-7814ccaddd4e", // project planning
  ],
  "웰니스·습관": [
    "photo-1506126613408-eca07ce68773", // yoga (current)
    "photo-1544716278-ca5e3f4abd8c", // fitness
    "photo-1543269865-cbf427effbad", // gym workout
    "photo-1571019613454-1cb2f99b2d8b", // running
    "photo-1476480862126-209bfaa8edc8", // morning run
    "photo-1517836357463-d25dfeac3438", // healthy meal
    "photo-1490645935967-10de6ba17061", // healthy food
    "photo-1466637574441-749b8f19452f", // salad healthy
    "photo-1505576399279-565b52d4ac71", // water drinking
    "photo-1571019614242-c5c5dee9f50b", // stretching
    "photo-1524678606370-a47ad25cb82a", // sleep wellness
    "photo-1545205597-3d9d02c29597", // meditation
    "photo-1552674605-db6ffd4facb5", // gym exercise
    "photo-1434682881908-b43d0467b798", // outdoor wellness
    "photo-1593079831268-3381b0db4a77", // habit tracker
    "photo-1556909114-f6e7ad7d3136", // healthy cooking
    "photo-1615729947596-a598e5de0ab3", // morning routine
    "photo-1498837167922-ddd27525d352", // fresh vegetables
    "photo-1574680096145-d05b474e2155", // fitness goals
    "photo-1461897104016-0b3b00cc81ee", // running shoes
  ],
  "SEO·콘텐츠 운영": [
    "photo-1562577309-4932fdd64cd1", // analytics data
    "photo-1551288049-bebda4e38f71", // data dashboard
    "photo-1460925895917-afdab827c52f", // growth chart
    "photo-1504868584819-f8e8b4b6d7e3", // content creation
    "photo-1493612276216-ee3925520721", // blogging laptop
    "photo-1519389950473-47ba0277781c", // team content
    "photo-1533750516457-a7f992034fec", // content writing
    "photo-1432888498266-38ffec3eaf0a", // seo strategy
    "photo-1507003211169-0a1dd7228f2d", // content creator
    "photo-1434030216411-0b793f4b4173", // content planning
    "photo-1504711434969-e33886168f5c", // search engine
    "photo-1594882645126-14020914d58d", // blog writing
    "photo-1533750349088-cd871a92f312", // content strategy
  ],
};

// slug에서 해시값 계산 (0-N)
function slugHash(slug, max) {
  let h = 0;
  for (let i = 0; i < slug.length; i++) {
    h = (h * 31 + slug.charCodeAt(i)) >>> 0;
  }
  return h % max;
}

// 카테고리 풀 + slug 기반 결정론적 썸네일 할당
function assignThumbnail(article, categoryIndex) {
  const pool = CATEGORY_POOLS[article.category];
  if (pool) {
    // 카테고리 풀에서 categoryIndex로 순차 선택 (겹치지 않게)
    const photoId = pool[categoryIndex % pool.length];
    return `https://images.unsplash.com/${photoId}?q=80&w=1600&auto=format&fit=crop`;
  }
  // 알 수 없는 카테고리: slug 해시 기반 picsum
  return `https://picsum.photos/seed/${article.slug}/1600/900`;
}

async function main() {
  console.log("🖼️  썸네일 고유화 시작...\n");

  // 카테고리별 인덱스 카운터
  const categoryCounters = {};

  // chunk 파일 처리
  const chunkFiles = fs.readdirSync(CHUNK_DIR).sort();
  let totalUpdated = 0;

  for (const filename of chunkFiles) {
    const filepath = path.join(CHUNK_DIR, filename);
    const articles = JSON.parse(fs.readFileSync(filepath, "utf8"));

    let chunkUpdated = 0;
    for (const article of articles) {
      const cat = article.category;
      if (!categoryCounters[cat]) categoryCounters[cat] = 0;

      const newThumbnail = assignThumbnail(article, categoryCounters[cat]);
      if (article.thumbnail !== newThumbnail) {
        article.thumbnail = newThumbnail;
        chunkUpdated++;
      }
      categoryCounters[cat]++;
    }

    fs.writeFileSync(filepath, JSON.stringify(articles, null, 2), "utf8");
    console.log(`✅ ${filename}: ${articles.length}개 처리 (${chunkUpdated}개 변경)`);
    totalUpdated += chunkUpdated;
  }

  // content-plan.generated.json 도 동일하게 업데이트
  const plan = JSON.parse(fs.readFileSync(PLAN_PATH, "utf8"));
  const planCounters = {};
  let planUpdated = 0;

  for (const article of plan) {
    const cat = article.category;
    if (!planCounters[cat]) planCounters[cat] = 0;

    const newThumbnail = assignThumbnail(article, planCounters[cat]);
    if (article.thumbnail !== newThumbnail) {
      article.thumbnail = newThumbnail;
      planUpdated++;
    }
    planCounters[cat]++;
  }

  fs.writeFileSync(PLAN_PATH, JSON.stringify(plan, null, 2), "utf8");
  console.log(`\n✅ content-plan.generated.json: ${plan.length}개 처리 (${planUpdated}개 변경)`);

  // 결과 요약
  console.log(`\n📊 결과 요약:`);
  for (const [cat, count] of Object.entries(categoryCounters)) {
    const pool = CATEGORY_POOLS[cat];
    const uniqueCount = Math.min(count, pool?.length ?? count);
    console.log(`  ${cat}: ${count}개 글, ${pool?.length ?? '?'}개 풀 → ${uniqueCount}가지 고유 이미지`);
  }
  console.log(`\n🎉 완료! 총 ${totalUpdated}개 썸네일 변경됨`);
}

main().catch(console.error);
