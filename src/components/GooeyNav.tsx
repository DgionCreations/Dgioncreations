import { useRef, useEffect, useState, KeyboardEvent, MouseEvent } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import './GooeyNav.css';
import { type TextStyle, textStyleToCss } from '@/content/typography';

interface NavItem {
  label: string;
  href: string;
  subItems?: NavItem[];
}

interface GooeyNavProps {
  items: NavItem[];
  textStyle?: TextStyle;
  animationTime?: number;
  particleCount?: number;
  particleDistances?: [number, number];
  particleR?: number;
  timeVariance?: number;
  colors?: number[];
  initialActiveIndex?: number;
}

const GooeyNav = ({
  items,
  textStyle,
  animationTime = 600,
  particleCount = 15,
  particleDistances = [90, 10],
  particleR = 100,
  timeVariance = 300,
  colors = [1, 2, 3, 1, 2, 3, 1, 4],
  initialActiveIndex = 0
}: GooeyNavProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const navRef = useRef<HTMLUListElement>(null);
  const filterRef = useRef<HTMLSpanElement>(null);
  const textRef = useRef<HTMLSpanElement>(null);
  const navigate = useNavigate();
  const location = useLocation();

  // Find active index based on current route
  const routeActiveIndex = items.findIndex((item) => item.href === location.pathname);
  const [activeIndex, setActiveIndex] = useState(
    routeActiveIndex >= 0 ? routeActiveIndex : initialActiveIndex
  );

  // Keep active index synced with route changes (e.g. back/forward, programmatic navigate)
  useEffect(() => {
    if (routeActiveIndex >= 0 && routeActiveIndex !== activeIndex) {
      setActiveIndex(routeActiveIndex);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [routeActiveIndex]);

  const noise = (n = 1) => n / 2 - Math.random() * n;

  const getXY = (distance: number, pointIndex: number, totalPoints: number) => {
    const angle = ((360 + noise(8)) / totalPoints) * pointIndex * (Math.PI / 180);
    return [distance * Math.cos(angle), distance * Math.sin(angle)];
  };

  const createParticle = (i: number, t: number, d: [number, number], r: number) => {
    let rotate = noise(r / 10);
    return {
      start: getXY(d[0], particleCount - i, particleCount),
      end: getXY(d[1] + noise(7), particleCount - i, particleCount),
      time: t,
      scale: 1 + noise(0.2),
      color: colors[Math.floor(Math.random() * colors.length)],
      rotate: rotate > 0 ? (rotate + r / 20) * 10 : (rotate - r / 20) * 10
    };
  };

  const makeParticles = (element: HTMLElement) => {
    const d = particleDistances;
    const r = particleR;
    const bubbleTime = animationTime * 2 + timeVariance;
    element.style.setProperty('--time', `${bubbleTime}ms`);

    for (let i = 0; i < particleCount; i++) {
      const t = animationTime * 2 + noise(timeVariance * 2);
      const p = createParticle(i, t, d, r);
      element.classList.remove('active');

      setTimeout(() => {
        const particle = document.createElement('span');
        const point = document.createElement('span');
        particle.classList.add('particle');
        particle.style.setProperty('--start-x', `${p.start[0]}px`);
        particle.style.setProperty('--start-y', `${p.start[1]}px`);
        particle.style.setProperty('--end-x', `${p.end[0]}px`);
        particle.style.setProperty('--end-y', `${p.end[1]}px`);
        particle.style.setProperty('--time', `${p.time}ms`);
        particle.style.setProperty('--scale', `${p.scale}`);
        particle.style.setProperty('--color', `var(--color-${p.color}, white)`);
        particle.style.setProperty('--rotate', `${p.rotate}deg`);

        point.classList.add('point');
        particle.appendChild(point);
        element.appendChild(particle);
        requestAnimationFrame(() => {
          element.classList.add('active');
        });
        setTimeout(() => {
          try {
            element.removeChild(particle);
          } catch {
            // Do nothing
          }
        }, t);
      }, 30);
    }
  };

  const updateEffectPosition = (element: HTMLElement) => {
    if (!containerRef.current || !filterRef.current || !textRef.current) return;
    const containerRect = containerRef.current.getBoundingClientRect();
    const pos = element.getBoundingClientRect();

    const styles = {
      left: `${pos.x - containerRect.x}px`,
      top: `${pos.y - containerRect.y}px`,
      width: `${pos.width}px`,
      height: `${pos.height}px`
    };
    Object.assign(filterRef.current.style, styles);
    Object.assign(textRef.current.style, styles);
    textRef.current.innerText = element.innerText;
  };

  const handleClick = (e: MouseEvent<HTMLAnchorElement> | { currentTarget: HTMLElement }, index: number) => {
    const target = e.currentTarget as HTMLElement;
    // For anchor clicks, we want the PARENT li to be the reference for position
    const liEl = target.tagName === 'A' ? target.parentElement : target;
    if (!liEl) return;

    // Prevent native anchor navigation — use SPA navigation via react-router instead
    if ('preventDefault' in e && typeof (e as MouseEvent<HTMLAnchorElement>).preventDefault === 'function') {
      (e as MouseEvent<HTMLAnchorElement>).preventDefault();
    }
    const destination = items[index]?.href;
    if (destination) {
      navigate(destination);
    }

    if (activeIndex === index) return;

    setActiveIndex(index);
    updateEffectPosition(liEl);

    if (filterRef.current) {
      const particles = filterRef.current.querySelectorAll('.particle');
      particles.forEach(p => filterRef.current?.removeChild(p));
    }

    if (textRef.current) {
      textRef.current.classList.remove('active');
      void textRef.current.offsetWidth;
      textRef.current.classList.add('active');
    }

    if (filterRef.current) {
      makeParticles(filterRef.current);
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLAnchorElement>, index: number) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      const liEl = (e.currentTarget as HTMLElement).parentElement;
      if (liEl) {
        handleClick({ currentTarget: liEl }, index);
      }
    }
  };

  useEffect(() => {
    if (!navRef.current || !containerRef.current) return;
    const activeLi = navRef.current.querySelectorAll('li')[activeIndex] as HTMLElement | undefined;
    if (activeLi) {
      updateEffectPosition(activeLi);
      if (textRef.current) textRef.current.classList.add('active');
    }

    const resizeObserver = new ResizeObserver(() => {
      const currentActiveLi = navRef.current?.querySelectorAll('li')[activeIndex];
      if (currentActiveLi) {
        updateEffectPosition(currentActiveLi);
      }
    });

    resizeObserver.observe(containerRef.current);
    return () => resizeObserver.disconnect();
  }, [activeIndex]);

  const customStyles = textStyle ? textStyleToCss(textStyle) : {};

  return (
    <div className="gooey-nav-container" ref={containerRef}>
      <nav>
        <ul ref={navRef}>
          {items.map((item, index) => (
            <li 
              key={index} 
              className={`relative group/nav-item ${activeIndex === index ? 'active' : ''}`}
            >
              <a 
                href={item.href} 
                onClick={e => handleClick(e, index)} 
                onKeyDown={e => handleKeyDown(e, index)}
                style={customStyles}
                className="flex items-center gap-1"
              >
                {item.label}
                {item.subItems && (
                  <svg className="w-3 h-3 opacity-30 group-hover/nav-item:rotate-180 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M19 9l-7 7-7-7" />
                  </svg>
                )}
              </a>

              {/* Dropdown Menu */}
              {item.subItems && (
                <div className="absolute top-full left-1/2 -translate-x-1/2 pt-4 opacity-0 invisible group-hover/nav-item:opacity-100 group-hover/nav-item:visible transition-all duration-300 transform scale-95 group-hover/nav-item:scale-100">
                  <div className="bg-[#1A1440]/90 backdrop-blur-2xl border border-white/10 rounded-2xl p-2 min-w-[200px] shadow-[0_20px_50px_rgba(0,0,0,0.5)]">
                    {item.subItems.map((sub, si) => (
                      <button
                        key={si}
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate(sub.href);
                        }}
                        className="w-full text-left px-4 py-3 rounded-xl text-white/60 hover:text-white hover:bg-white/5 transition-all text-xs font-bold uppercase tracking-widest flex items-center justify-between group/sub"
                      >
                        {sub.label}
                        <div className="w-1 h-1 rounded-full bg-[#837FFB] opacity-0 group-hover/sub:opacity-100 transition-opacity" />
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </li>
          ))}
        </ul>
      </nav>
      <span className="effect filter" ref={filterRef} />
      <span className="effect text" ref={textRef} style={customStyles} />
    </div>
  );
};

export default GooeyNav;
