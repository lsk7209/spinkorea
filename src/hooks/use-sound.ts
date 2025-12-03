/**
 * 오디오 관리 훅
 * AudioContext는 첫 사용자 인터랙션 시 초기화
 */

import { useRef, useCallback } from 'react';

interface UseSoundOptions {
  tickSoundUrl?: string;
  winSoundUrl?: string;
}

/**
 * 사운드 훅
 * @param options - 사운드 옵션
 * @returns 사운드 재생 함수
 */
export function useSound(options: UseSoundOptions = {}) {
  const audioContextRef = useRef<AudioContext | null>(null);
  const tickAudioRef = useRef<HTMLAudioElement | null>(null);
  const winAudioRef = useRef<HTMLAudioElement | null>(null);
  const isInitializedRef = useRef(false);

  const initializeAudio = useCallback(() => {
    if (isInitializedRef.current || audioContextRef.current) {
      return;
    }

    try {
      audioContextRef.current = new AudioContext();
      
      if (options.tickSoundUrl) {
        tickAudioRef.current = new Audio(options.tickSoundUrl);
        tickAudioRef.current.loop = true;
      }
      
      if (options.winSoundUrl) {
        winAudioRef.current = new Audio(options.winSoundUrl);
      }

      isInitializedRef.current = true;
    } catch (error) {
      console.error('Failed to initialize audio:', error);
    }
  }, [options.tickSoundUrl, options.winSoundUrl]);

  const playTick = useCallback(() => {
    if (!isInitializedRef.current) {
      initializeAudio();
    }

    if (audioContextRef.current?.state === 'suspended') {
      audioContextRef.current.resume();
    }

    if (tickAudioRef.current) {
      tickAudioRef.current.play().catch((error) => {
        console.error('Failed to play tick sound:', error);
      });
    }
  }, [initializeAudio]);

  const stopTick = useCallback(() => {
    if (tickAudioRef.current) {
      tickAudioRef.current.pause();
      tickAudioRef.current.currentTime = 0;
    }
  }, []);

  const playWin = useCallback(() => {
    if (!isInitializedRef.current) {
      initializeAudio();
    }

    if (audioContextRef.current?.state === 'suspended') {
      audioContextRef.current.resume();
    }

    if (winAudioRef.current) {
      winAudioRef.current.play().catch((error) => {
        console.error('Failed to play win sound:', error);
      });
    }
  }, [initializeAudio]);

  return {
    initializeAudio,
    playTick,
    stopTick,
    playWin,
  };
}

