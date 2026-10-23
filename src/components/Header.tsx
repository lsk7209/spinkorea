import { Link, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
export default function Header() {
 const [open,setOpen]=useState(false); const location=useLocation(); const trigger=useRef<HTMLButtonElement>(null);
 useEffect(()=>setOpen(false),[location.pathname]);
 const links=[['룰렛','/'],['도구 모음','/tools'],['사용 가이드','/blog'],['소개','/about']];
 const active=(path:string)=>path==='/' ? ['/', '/spinflow'].includes(location.pathname) : location.pathname.startsWith(path);
 return <header className="site-header" onKeyDown={e=>{if(e.key==='Escape'){setOpen(false);trigger.current?.focus();}}}>
 <a className="skip-link" href="#main-content">본문으로 건너뛰기</a>
 <div className="site-header-inner"><Link to="/" className="brand"><strong>SpinFlow</strong><span>스핀코리아</span></Link>
 <nav className="desktop-nav" aria-label="주 메뉴">{links.map(([label,path])=><Link key={path} to={path} aria-current={active(path)?'page':undefined}>{label}</Link>)}</nav>
 <button ref={trigger} className="menu-toggle" aria-label={open?'메뉴 닫기':'메뉴 열기'} aria-expanded={open} aria-controls="mobile-navigation" onClick={()=>setOpen(!open)}>{open?<X/>:<Menu/>}</button></div>
 {open&&<nav id="mobile-navigation" className="mobile-navigation" aria-label="모바일 주 메뉴">{links.map(([label,path])=><Link key={path} to={path} aria-current={active(path)?'page':undefined}>{label}</Link>)}</nav>}
 </header>;
}
