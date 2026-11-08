import { useId } from 'react';

export function LabIllustration({ kind }: { kind: 'binary' | 'index' }) {
  const identifier = useId();
  const binary = kind === 'binary';
  return (
    <svg viewBox="0 0 400 220" role="img" aria-label={binary ? '位开关与二进制数示意图' : '有序索引查找示意图'} className="h-auto w-full">
      <defs>
        <linearGradient id={identifier} x1="0" y1="0" x2="1" y2="1">
          <stop stopColor={binary ? '#A28BFF' : '#5BDCC0'} />
          <stop offset="1" stopColor={binary ? '#5A3DE6' : '#159B8C'} />
        </linearGradient>
      </defs>
      <ellipse cx="205" cy="194" rx="143" ry="15" fill={binary ? '#7B5CFF' : '#159B8C'} opacity=".09" />
      <circle cx="315" cy="60" r="43" fill="white" opacity=".65" />
      <circle cx="63" cy="145" r="28" fill="white" opacity=".5" />
      {binary ? (
        <>
          <path d="M90 83V53h65m153 92h35v-34M120 176v22m155-22v22" fill="none" stroke="#B8A6F4" strokeWidth="3" strokeLinecap="round" />
          <rect x="61" y="85" width="278" height="93" rx="23" fill="#CFC2F4" />
          <rect x="61" y="77" width="278" height="93" rx="23" fill="white" stroke="#DCD3FF" strokeWidth="2" />
          {[1, 0, 0, 0, 0, 0, 0, 0].map((bit, position) => (
            <g key={position}>
              <rect x={76 + position * 32} y="97" width="25" height="49" rx="8" fill={bit ? 'url(#' + identifier + ')' : '#F0ECFC'} />
              <text x={88.5 + position * 32} y="129" textAnchor="middle" fontFamily="monospace" fontSize="20" fontWeight="700" fill={bit ? 'white' : '#9C91B6'}>{bit}</text>
            </g>
          ))}
          <g transform="translate(154 22)">
            <rect y="5" width="102" height="49" rx="15" fill="#D7CDF3" />
            <rect width="102" height="49" rx="15" fill={'url(#' + identifier + ')'} />
            <text x="51" y="31" textAnchor="middle" fill="white" fontSize="22" fontWeight="800" fontFamily="monospace">8 bit</text>
          </g>
          <circle cx="343" cy="108" r="5" fill="#FFC530" />
          <circle cx="90" cy="53" r="5" fill="#7B5CFF" />
        </>
      ) : (
        <>
          <path d="M140 68v24m0 0H70v28m70-28h70v28m0 26h80" fill="none" stroke="#93D6C7" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
          {[[106, 24, '31'], [36, 120, '15'], [176, 120, '47']].map(([left, top, label]) => (
            <g key={label} transform={'translate(' + left + ' ' + top + ')'}>
              <rect y="6" width="68" height="48" rx="14" fill="#BDE5DB" />
              <rect width="68" height="48" rx="14" fill={label === '47' ? 'url(#' + identifier + ')' : 'white'} stroke={label === '47' ? '#159B8C' : '#C5E8DE'} strokeWidth="2" />
              <text x="34" y="32" textAnchor="middle" fontFamily="monospace" fontSize="24" fontWeight="700" fill={label === '47' ? 'white' : '#397A6D'}>{label}</text>
            </g>
          ))}
          <g transform="translate(279 73)">
            <path d="M0 15v76c0 20 72 20 72 0V15" fill="white" stroke="#9CD7CA" strokeWidth="2" />
            <ellipse cx="36" cy="15" rx="36" ry="14" fill="#D9F5EB" stroke="#9CD7CA" strokeWidth="2" />
            <path d="M0 43c0 19 72 19 72 0m-72 26c0 19 72 19 72 0" fill="none" stroke="#B1DFD3" strokeWidth="2" />
          </g>
          <circle cx="245" cy="47" r="19" fill="#FFF5D6" />
          <path d="m237 47 5 5 10-11" fill="none" stroke="#D4A31E" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
        </>
      )}
    </svg>
  );
}
