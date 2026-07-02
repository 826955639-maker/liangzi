import { useCallback, useEffect, useRef } from "react";
import type { CreationResult } from "./CreationScene";

type AudioEngine = {
  context: AudioContext;
  master: GainNode;
  droneGain: GainNode;
  chargeOscillator: OscillatorNode;
  chargeGain: GainNode;
};

export default function useCreationAudio(onLog: (message: string) => void) {
  const engineRef = useRef<AudioEngine | null>(null);
  const timeoutsRef = useRef<number[]>([]);

  const initialize = useCallback(() => {
    if (engineRef.current) return engineRef.current;
    const AudioContextClass = window.AudioContext
      ?? (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (!AudioContextClass) return null;

    try {
      const context = new AudioContextClass();
      const master = context.createGain();
      master.gain.setValueAtTime(0.3, context.currentTime);
      master.connect(context.destination);

      const drone = context.createOscillator();
      const sub = context.createOscillator();
      const droneGain = context.createGain();
      const filter = context.createBiquadFilter();
      drone.type = "sawtooth";
      drone.frequency.setValueAtTime(55, context.currentTime);
      sub.type = "sine";
      sub.frequency.setValueAtTime(110, context.currentTime);
      filter.type = "lowpass";
      filter.frequency.setValueAtTime(120, context.currentTime);
      filter.Q.setValueAtTime(5, context.currentTime);
      drone.connect(filter);
      sub.connect(filter);
      filter.connect(droneGain);
      droneGain.connect(master);
      droneGain.gain.setValueAtTime(0.08, context.currentTime);
      drone.start();
      sub.start();

      const chargeOscillator = context.createOscillator();
      const chargeGain = context.createGain();
      const chargeFilter = context.createBiquadFilter();
      chargeOscillator.type = "triangle";
      chargeOscillator.frequency.setValueAtTime(150, context.currentTime);
      chargeGain.gain.setValueAtTime(0, context.currentTime);
      chargeFilter.type = "lowpass";
      chargeFilter.frequency.setValueAtTime(500, context.currentTime);
      chargeOscillator.connect(chargeFilter);
      chargeFilter.connect(chargeGain);
      chargeGain.connect(master);
      chargeOscillator.start();

      engineRef.current = { context, master, droneGain, chargeOscillator, chargeGain };
      onLog("微观共鸣声音引擎加载成功。");
      return engineRef.current;
    } catch {
      return null;
    }
  }, [onLog]);

  const playTone = useCallback((frequency: number, volume: number, duration: number) => {
    const engine = engineRef.current;
    if (!engine) return;
    const now = engine.context.currentTime;
    const oscillator = engine.context.createOscillator();
    const gain = engine.context.createGain();
    const delay = engine.context.createDelay();
    const feedback = engine.context.createGain();
    oscillator.type = "sine";
    oscillator.frequency.setValueAtTime(frequency, now);
    gain.gain.setValueAtTime(volume, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + duration);
    delay.delayTime.setValueAtTime(0.15, now);
    feedback.gain.setValueAtTime(0.4, now);
    oscillator.connect(gain);
    gain.connect(engine.master);
    gain.connect(delay);
    delay.connect(feedback);
    feedback.connect(delay);
    delay.connect(engine.master);
    oscillator.start();
    oscillator.stop(now + duration + 0.5);
  }, []);

  const playImpact = useCallback((result: CreationResult) => {
    const engine = engineRef.current;
    if (!engine) return;
    const now = engine.context.currentTime;
    const buffer = engine.context.createBuffer(1, engine.context.sampleRate * 0.4, engine.context.sampleRate);
    const data = buffer.getChannelData(0);
    for (let index = 0; index < data.length; index += 1) data[index] = Math.random() * 2 - 1;
    const source = engine.context.createBufferSource();
    const filter = engine.context.createBiquadFilter();
    const gain = engine.context.createGain();
    source.buffer = buffer;
    filter.type = "lowpass";
    filter.frequency.setValueAtTime(1000, now);
    filter.frequency.linearRampToValueAtTime(100, now + 0.4);
    gain.gain.setValueAtTime(0.3, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.4);
    source.connect(filter);
    filter.connect(gain);
    gain.connect(engine.master);
    source.start();

    const notes = result === "alive"
      ? [[261.63, 0], [329.63, 100], [392, 200], [523.25, 300]]
      : [[220, 0], [261.63, 120], [311.13, 240], [349.23, 360]];
    notes.forEach(([frequency, delay], index) => {
      const timeout = window.setTimeout(() => playTone(frequency, index === 3 ? 0.15 : 0.1, index === 3 ? 1.5 : 1.2), delay);
      timeoutsRef.current.push(timeout);
    });
  }, [playTone]);

  const transition = useCallback((state: "A" | "B" | "C", result?: CreationResult) => {
    const engine = engineRef.current;
    if (!engine) return;
    if (engine.context.state === "suspended") void engine.context.resume();
    const now = engine.context.currentTime;
    if (state === "A") {
      engine.droneGain.gain.linearRampToValueAtTime(0.12, now + 0.5);
      engine.chargeGain.gain.linearRampToValueAtTime(0, now + 0.2);
    } else if (state === "B") {
      engine.chargeOscillator.frequency.setValueAtTime(110, now);
      engine.chargeGain.gain.linearRampToValueAtTime(0.2, now + 0.1);
      engine.droneGain.gain.linearRampToValueAtTime(0.03, now + 0.5);
    } else {
      engine.chargeGain.gain.linearRampToValueAtTime(0, now + 0.05);
      engine.droneGain.gain.linearRampToValueAtTime(0.01, now + 0.05);
      if (result) playImpact(result);
    }
  }, [playImpact]);

  const sweep = useCallback((progress: number) => {
    const engine = engineRef.current;
    if (!engine) return;
    const now = engine.context.currentTime;
    const frequency = 110 + (progress / 100) * 550;
    engine.chargeOscillator.frequency.setTargetAtTime(frequency, now, 0.05);
    engine.chargeOscillator.frequency.setValueAtTime(
      frequency + Math.sin(now * 30) * (progress / 100) * 30,
      now,
    );
  }, []);

  const setMuted = useCallback((muted: boolean) => {
    const engine = engineRef.current;
    if (!engine) return;
    engine.master.gain.setValueAtTime(muted ? 0 : 0.3, engine.context.currentTime);
  }, []);

  useEffect(() => () => {
    timeoutsRef.current.forEach((timeout) => window.clearTimeout(timeout));
    timeoutsRef.current = [];
    const engine = engineRef.current;
    engineRef.current = null;
    if (engine && engine.context.state !== "closed") void engine.context.close().catch(() => undefined);
  }, []);

  return { initialize, transition, sweep, setMuted };
}
