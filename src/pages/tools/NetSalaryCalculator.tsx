import { useState } from 'react';
import ToolLayout from '@/components/ToolLayout';
import { calculatePension } from '@/utils/pension';
import { calculateWithholdingTax } from '@/utils/withholding-tax';
const fmt=(value:number)=>Math.round(value).toLocaleString('ko-KR');
const floor10=(value:number)=>Math.floor(value/10)*10;
const inputClass='w-full rounded-lg border border-[#7A8175] bg-[#FFFEF8] px-3 py-3';
export default function NetSalaryCalculator(){
 const [annual,setAnnual]=useState('42000000');
 const [month,setMonth]=useState('2026-10');
 const [nonTax,setNonTax]=useState('0');
 const [family,setFamily]=useState(1);
 const [children,setChildren]=useState(0);
 const gross=Number(annual)/12; const exempt=Number(nonTax); const taxable=gross-exempt;
 const valid=annual.trim()!==''&&nonTax.trim()!==''&&Number.isFinite(gross)&&gross>0&&Number.isFinite(exempt)&&exempt>=0&&exempt<=gross&&/^2026-(0[3-9]|1[0-2])$/.test(month);
 const pension=valid?calculatePension(taxable,month):null;
 const tax=valid?calculateWithholdingTax(taxable,family,children):null;
 const supported=valid&&pension!==null&&tax!==null;
 const health=floor10(taxable*0.03595);
 const care=floor10(health*(0.9448/7.19));
 const employment=floor10(taxable*0.009);
 const rows=[['국민연금',pension?.premium??0],['건강보험',health],['장기요양보험',care],['고용보험',employment],['소득세 (100% 원천징수)',tax??0],['지방소득세',floor10((tax??0)*0.1)]] as const;
 const total=rows.reduce((sum,[,amount])=>sum+amount,0);
 return <ToolLayout title="연봉 실수령액 계산기 | 4대보험·소득세 공제 후 월급" description="2026년 기준월과 비과세 월액, 공제대상 가족 수를 적용해 월 급여 공제액을 참고 계산합니다." keywords="연봉실수령액,실수령액계산기,4대보험,근로소득간이세액표"
 sources={[
 {name:'국가법령정보센터 — 근로소득 간이세액표 별표 2 (2026.2.27 개정)',url:'https://www.law.go.kr/LSW/flDownload.do?bylClsCd=110201&flSeq=169798151'},
 {name:'국민연금공단 — 기준소득월액 적용기간과 상·하한',url:'https://nps.or.kr/pnsinfo/ntpsklg/getOHAF0038M0.do?menuId=MN24001113&tab=tab5'},
 {name:'국민건강보험 — 2026년 건강·장기요양보험료율',url:'https://edi.nhis.or.kr/portal/images/popup/20251204_pop01longdesc.html'},
 {name:'고용보험 — 근로자 보험료율',url:'https://edrm.ei.go.kr/ei/eim/eg/ei/eiEminsr/retrieveEi0301Info.do'}]}
 reviewedAt="2026-10-23"
 disclaimer="상용근로자가 매달 동일 급여를 받는 참고 계산입니다. 국민연금 기준소득월액은 과세 월급을 천원 미만 절사한 값으로 가정하고 해당 기준월의 상·하한을 적용합니다. 건강·고용보험의 보수월액도 과세 월급과 같다고 가정하며 보험료는 10원 미만을 버립니다. 실제 신고 보수·개인별 가입 여부·정산·보험료 상하한·산정 예외는 반영하지 않습니다. 원천징수 100%만 지원하며 연말정산 확정세액이 아닙니다."
 howToUse={['세전 연봉과 2026년 기준월을 입력하세요.','월 비과세 금액과 본인을 포함한 공제대상 가족, 8~20세 자녀 수를 확인하세요.','실제 급여명세서의 신고 보수·공제 내역과 비교하세요.']}
 tips={['비과세 금액의 인정 여부는 급여 항목과 요건에 따라 다릅니다.','공제대상 가족은 세법상 공제 요건을 충족하는 인원입니다.','월 과세 급여 1천만원 이상과 2026년 3~12월 밖의 기준월은 계산하지 않습니다.']}
 faqs={[{question:'국민연금 상한은 언제 바뀌나요?',answer:'2026년 6월까지 기준소득월액 상한 637만원·하한 40만원, 7월부터 상한 659만원·하한 41만원을 적용합니다. 2026년 근로자 부담률은 4.75%입니다.'},{question:'가족 수가 같은데 세금이 다른 이유는?',answer:'비과세 급여, 자녀 공제, 원천징수 비율과 신고 조건이 다를 수 있습니다. 이 도구는 100% 간이세액표의 지원 구간만 계산합니다.'}]}
 relatedTools={[{name:'퇴직금 계산기',path:'/tools/severance-pay',description:'실제 달력 일수 기준 평균임금 참고 계산'},{name:'시급 계산기',path:'/tools/hourly-wage',description:'시급·월급 환산'}]}>
 <div className="grid gap-5">
 <div className="grid gap-4 sm:grid-cols-2">
 <label htmlFor="salary-annual">세전 연봉 (원)<input id="salary-annual" className={inputClass} type="number" min="1" value={annual} onChange={e=>setAnnual(e.target.value)}/></label>
 <label htmlFor="salary-month">급여 기준월<input id="salary-month" className={inputClass} type="month" min="2026-03" max="2026-12" value={month} onChange={e=>setMonth(e.target.value)}/></label>
 <label htmlFor="salary-exempt">월 비과세 금액 (원)<input id="salary-exempt" className={inputClass} type="number" min="0" value={nonTax} onChange={e=>setNonTax(e.target.value)}/></label>
 <label htmlFor="salary-family">공제대상 가족 수 (본인 포함)<select id="salary-family" className={inputClass} value={family} onChange={e=>{const n=Number(e.target.value);setFamily(n);setChildren(Math.min(children,n-1));}}>{Array.from({length:11},(_,i)=><option key={i+1} value={i+1}>{i+1}명</option>)}</select></label>
 <label htmlFor="salary-children">가족 중 8~20세 자녀 수<select id="salary-children" className={inputClass} value={children} onChange={e=>setChildren(Number(e.target.value))}>{Array.from({length:family},(_,i)=><option key={i} value={i}>{i}명</option>)}</select></label>
 </div>
 {!supported&&<p role="alert" className="border border-[#B42318] p-4 text-[#B42318]">입력과 지원 범위를 확인하세요. 연봉은 양수, 비과세 월액은 세전 월급 이하, 월 과세 급여는 1천만원 미만, 기준월은 2026년 3~12월이어야 합니다. 지원하지 않는 조건에는 결과를 표시하지 않습니다.</p>}
 {supported&&<section aria-label="급여 참고 계산 결과" className="border-t border-[#D5D5C9] pt-5">
 <p className="text-sm">{month} 기준 · 월 과세 급여 {fmt(taxable)}원 · 본인 포함 {family}명 · 자녀 {children}명</p>
 <h2 className="my-4 text-2xl">월 예상 실수령액 {fmt(gross-total)}원</h2>
 <p className="mb-4">세전 월급 {fmt(gross)}원 · 공제 합계 {fmt(total)}원</p>
 <dl>{rows.map(([label,value])=><div key={label} className="flex justify-between gap-4 border-b border-[#D5D5C9] py-3"><dt>{label}</dt><dd>{fmt(value)}원</dd></div>)}</dl>
 <p className="mt-4 text-sm">국민연금 산정 기준소득월액 {fmt(pension!.standardIncome)}원 · 근로자 부담률 4.75%. 계산 중간값을 10원 단위로 절사하며, 화면의 월급은 원 단위 반올림합니다.</p>
 </section>}
 </div>
 </ToolLayout>;
}
