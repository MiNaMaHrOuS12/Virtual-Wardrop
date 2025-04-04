import { create } from "zustand";
import { subscribeWithSelector } from "zustand/middleware";

export type GamePhase = "ready" | "playing" | "ended";

interface GameState {
  phase: GamePhase;
  score: number;
  highScore: number;
  lastActivity: Date | null;
  
  // Actions
  start: () => void;
  restart: () => void;
  end: () => void;
  increaseScore: (points: number) => void;
  updateActivity: () => void;
}

export const useGame = create<GameState>()(
  subscribeWithSelector((set, get) => ({
    phase: "ready",
    score: 0,
    highScore: 0,
    lastActivity: null,
    
    start: () => {
      set((state) => {
        // Only transition from ready to playing
        if (state.phase === "ready") {
          return { 
            phase: "playing", 
            score: 0,
            lastActivity: new Date()
          };
        }
        return {};
      });
    },
    
    restart: () => {
      set(() => ({ 
        phase: "ready",
        score: 0, 
        lastActivity: new Date()
      }));
    },
    
    end: () => {
      set((state) => {
        // Only transition from playing to ended
        if (state.phase === "playing") {
          // Update high score if needed
          const newHighScore = Math.max(state.highScore, state.score);
          
          return { 
            phase: "ended",
            highScore: newHighScore,
            lastActivity: new Date()
          };
        }
        return {};
      });
    },
    
    increaseScore: (points) => {
      set((state) => ({
        score: state.score + points,
        lastActivity: new Date()
      }));
    },
    
    updateActivity: () => {
      set({ lastActivity: new Date() });
    }
  }))
);
