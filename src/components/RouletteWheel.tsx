/**
 * Component: RouletteWheel
 * SVG 기반 원형 룰렛 휠 컴포넌트
 * @param {string[]} items - 룰렛 항목 배열 [Required]
 * @param {number | null} winningIndex - 당첨 인덱스 [Optional]
 * @param {boolean} isSpinning - 회전 중 여부 [Optional, default=false]
 * @param {number} size - 휠 크기 (픽셀) [Optional, default=300]
 * @example <RouletteWheel items={['항목1', '항목2']} winningIndex={0} isSpinning={false} />
 */

import { useMemo, useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

interface RouletteWheelProps {
  items: string[];
  winningIndex: number | null;
  isSpinning: boolean;
  size?: number;
}

export default function RouletteWheel({
  items,
  winningIndex,
  isSpinning,
  size = 300,
}: RouletteWheelProps) {
  const radius = size / 2;
  const centerX = radius;
  const centerY = radius;

  // 섹터 각도 계산
  const sectors = useMemo(() => {
    if (items.length === 0) {
      return [];
    }

    const anglePerSector = 360 / items.length;
    return items.map((item, index) => {
      const startAngle = index * anglePerSector - 90; // -90도부터 시작 (상단)
      const endAngle = (index + 1) * anglePerSector - 90;
      
      // SVG path 계산
      const startAngleRad = (startAngle * Math.PI) / 180;
      const endAngleRad = (endAngle * Math.PI) / 180;
      
      const x1 = centerX + radius * Math.cos(startAngleRad);
      const y1 = centerY + radius * Math.sin(startAngleRad);
      const x2 = centerX + radius * Math.cos(endAngleRad);
      const y2 = centerY + radius * Math.sin(endAngleRad);
      
      const largeArcFlag = anglePerSector > 180 ? 1 : 0;
      
      const path = `M ${centerX} ${centerY} L ${x1} ${y1} A ${radius} ${radius} 0 ${largeArcFlag} 1 ${x2} ${y2} Z`;
      
      // 텍스트 위치 계산
      const textAngle = (startAngle + endAngle) / 2;
      const textAngleRad = (textAngle * Math.PI) / 180;
      const textRadius = radius * 0.7;
      const textX = centerX + textRadius * Math.cos(textAngleRad);
      const textY = centerY + textRadius * Math.sin(textAngleRad);
      
      return {
        index,
        item,
        path,
        textX,
        textY,
        textAngle: textAngle + 90, // SVG 변환을 위해 조정
      };
    });
  }, [items, radius, centerX, centerY]);

  // 회전 각도 계산
  const currentRotationRef = useRef(0);
  const [rotation, setRotation] = useState(0);

  useEffect(() => {
    if (items.length === 0 || winningIndex === null) {
      return;
    }

    if (isSpinning) {
      // 스핀 시작: 현재 위치에서 최소 3바퀴 이상 회전하여 당첨 위치로
      const anglePerSector = 360 / items.length;
      
      // 섹터는 -90도부터 시작 (상단이 0도)
      // 당첨 섹터의 중앙 각도 계산 (라디안이 아닌 도 단위)
      const sectorStartAngle = winningIndex * anglePerSector - 90;
      const sectorEndAngle = (winningIndex + 1) * anglePerSector - 90;
      const sectorCenterAngle = (sectorStartAngle + sectorEndAngle) / 2;
      
      // 포인터가 상단(0도)을 가리키므로, 당첨 섹터 중앙이 0도에 오도록 회전
      // SVG rotate는 시계 방향이므로, 반시계 방향으로 회전하려면 음수
      // 섹터 중앙이 0도에 오려면: rotation = -sectorCenterAngle
      const targetRotation = -sectorCenterAngle;
      
      // 최소 3바퀴 (1080도) 이상 회전
      // 현재 회전에서 시작하여 최소 3바퀴 + 목표 각도
      const baseRotation = currentRotationRef.current % 360; // 현재 각도를 0-360 범위로
      const minFullRotations = 1080; // 최소 3바퀴
      const totalRotation = baseRotation + minFullRotations + targetRotation;
      
      setRotation(totalRotation);
      currentRotationRef.current = totalRotation;
    } else {
      // 스핀 종료: 당첨 위치에 정확히 멈춤 (이미 계산된 rotation 유지)
    }
  }, [isSpinning, winningIndex, items.length]);

  // 개선된 색상 팔레트
  const solidColors = [
    '#00d9ff',
    '#ff006e',
    '#00ff88',
    '#ffaa00',
    '#aa00ff',
    '#00aaff',
    '#ff0066',
    '#66ff00',
  ];

  return (
    <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        className="relative z-10"
      >
        <defs>
          <filter id="glow">
            <feGaussianBlur stdDeviation="3" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>
        
        <motion.g
          animate={{
            rotate: rotation,
          }}
          transition={{
            duration: isSpinning ? 3 + Math.random() * 4 : 0.5, // 3-7초 스핀, 0.5초 정지
            ease: isSpinning ? [0.25, 0.1, 0.25, 1] : 'easeOut', // 물리 기반 감속
          }}
          style={{
            transformOrigin: `${centerX}px ${centerY}px`,
          }}
        >
          {sectors.map((sector, idx) => {
            const isWinner = winningIndex === sector.index;
            const colorIndex = idx % solidColors.length;
            const solidColor = solidColors[colorIndex];
            
            return (
              <g key={sector.index}>
                <defs>
                  <linearGradient id={`gradient-${sector.index}`} x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor={solidColor} stopOpacity={isWinner ? "1" : "0.6"} />
                    <stop offset="100%" stopColor={solidColor} stopOpacity={isWinner ? "0.8" : "0.4"} />
                  </linearGradient>
                </defs>
                <path
                  d={sector.path}
                  fill={`url(#gradient-${sector.index})`}
                  stroke={isWinner ? '#00d9ff' : 'rgba(0, 217, 255, 0.1)'}
                  strokeWidth={isWinner ? 3 : 1}
                  filter={isWinner ? 'url(#glow)' : undefined}
                  className={isWinner ? 'neon-glow' : ''}
                  style={{
                    transition: 'all 0.3s ease',
                  }}
                />
                <text
                  x={sector.textX}
                  y={sector.textY}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  fill={isWinner ? '#ffffff' : 'rgba(255, 255, 255, 0.9)'}
                  fontSize={Math.max(11, size / items.length / 2.8)}
                  fontWeight={isWinner ? 'bold' : '600'}
                  transform={`rotate(${sector.textAngle}, ${sector.textX}, ${sector.textY})`}
                  className="select-none"
                  style={{
                    textShadow: isWinner ? '0 0 10px rgba(0, 217, 255, 0.8)' : '0 1px 2px rgba(0, 0, 0, 0.3)',
                    transition: 'all 0.3s ease',
                  }}
                >
                  {sector.item.length > 15
                    ? `${sector.item.substring(0, 12)}...`
                    : sector.item}
                </text>
              </g>
            );
          })}
        </motion.g>
        
        {/* 중앙 포인터 */}
        <defs>
          <linearGradient id="pointer-gradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#00d9ff" stopOpacity="1" />
            <stop offset="100%" stopColor="#00b8d9" stopOpacity="1" />
          </linearGradient>
        </defs>
        <polygon
          points={`${centerX},${centerY - radius} ${centerX - 18},${centerY - radius + 25} ${centerX + 18},${centerY - radius + 25}`}
          fill="url(#pointer-gradient)"
          filter="url(#glow)"
          className="neon-glow"
          style={{
            transition: 'all 0.3s ease',
          }}
        />
      </svg>
    </div>
  );
}

