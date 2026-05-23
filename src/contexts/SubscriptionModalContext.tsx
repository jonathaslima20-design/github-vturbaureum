import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import type { LimitReason } from '@/types';

interface SubscriptionModalContextType {
  isOpen: boolean;
  isForced: boolean;
  limitReason: LimitReason;
  openModal: (forced?: boolean, reason?: LimitReason) => void;
  closeModal: () => void;
  setForced: (forced: boolean) => void;
}

const SubscriptionModalContext = createContext<SubscriptionModalContextType | undefined>(undefined);

export function SubscriptionModalProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [isForced, setIsForced] = useState(false);
  const [limitReason, setLimitReason] = useState<LimitReason>(null);

  const openModal = useCallback((forced = false, reason: LimitReason = null) => {
    setIsOpen(true);
    setIsForced(forced);
    setLimitReason(reason);
  }, []);

  const closeModal = useCallback(() => {
    if (!isForced) {
      setIsOpen(false);
      setLimitReason(null);
    }
  }, [isForced]);

  const setForcedState = useCallback((forced: boolean) => {
    setIsForced(forced);
  }, []);

  const value = {
    isOpen,
    isForced,
    limitReason,
    openModal,
    closeModal,
    setForced: setForcedState,
  };

  return (
    <SubscriptionModalContext.Provider value={value}>
      {children}
    </SubscriptionModalContext.Provider>
  );
}

export function useSubscriptionModal() {
  const context = useContext(SubscriptionModalContext);
  if (context === undefined) {
    throw new Error('useSubscriptionModal must be used within SubscriptionModalProvider');
  }
  return context;
}
