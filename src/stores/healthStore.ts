import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { HealthMetrics, HealthStore } from '@/types';
import { generateMockHealthMetrics } from '@/lib/utils';

export const useHealthStore = create<HealthStore>()(
  persist(
    (set, get) => ({
      currentMetrics: null,
      history: [],
      isSimulating: false,

      startSimulation: () => {
        const { isSimulating } = get();

        if (isSimulating) return;

        set({ isSimulating: true });

        // Generate initial metrics
        const initialMetrics = generateMockHealthMetrics();
        set({ currentMetrics: initialMetrics });

        // Start simulation interval
        const interval = setInterval(() => {
          const { isSimulating: currentlySimulating, addMetrics } = get();

          if (!currentlySimulating) {
            clearInterval(interval);
            return;
          }

          const newMetrics = generateMockHealthMetrics();
          addMetrics(newMetrics);
        }, 30000); // Update every 30 seconds

        // Clean up on window unload
        if (typeof window !== 'undefined') {
          const cleanup = () => {
            clearInterval(interval);
            set({ isSimulating: false });
          };

          window.addEventListener('beforeunload', cleanup);

          // Store interval ID for cleanup
          (window as any).__healthSimulationInterval = interval;
          (window as any).__healthSimulationCleanup = cleanup;
        }
      },

      stopSimulation: () => {
        set({ isSimulating: false });

        if (typeof window !== 'undefined') {
          const interval = (window as any).__healthSimulationInterval;
          const cleanup = (window as any).__healthSimulationCleanup;

          if (interval) {
            clearInterval(interval);
          }

          if (cleanup) {
            window.removeEventListener('beforeunload', cleanup);
          }
        }
      },

      addMetrics: (metrics: HealthMetrics) => {
        set((state) => ({
          currentMetrics: metrics,
          history: [...state.history, metrics].slice(-100), // Keep last 100 entries
        }));
      },

      updateMetrics: (updates: Partial<HealthMetrics>) => {
        set((state) => {
          if (!state.currentMetrics) return state;

          const updatedMetrics = {
            ...state.currentMetrics,
            ...updates,
            timestamp: new Date(),
          };

          return {
            currentMetrics: updatedMetrics,
            history: [...state.history, updatedMetrics].slice(-100),
          };
        });
      },
    }),
    {
      name: 'silvercare-health-store',
      partialize: (state) => ({
        history: state.history.slice(-50), // Keep last 50 entries in storage
        currentMetrics: state.currentMetrics,
        // Don't persist simulation state
      }),
      onRehydrateStorage: () => (state) => {
        if (state?.history) {
          // Convert timestamp strings back to Date objects
          state.history = state.history.map(metrics => ({
            ...metrics,
            timestamp: new Date(metrics.timestamp),
          }));
        }
        if (state?.currentMetrics) {
          state.currentMetrics = {
            ...state.currentMetrics,
            timestamp: new Date(state.currentMetrics.timestamp),
          };
        }
      },
    }
  )
);