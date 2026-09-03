import { useCallback, useEffect, useRef, useState } from 'react';
import { authStorage } from '../services/authStorage';

export type LoginPhase = 'waiting' | 'scanning' | 'authenticated';
export type AppActiveView = 'portal' | 'operation';

export const useAppEntryViewModel = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(() =>
    authStorage.readIsAuthenticated()
  );
  const [activeView, setActiveView] = useState<AppActiveView>(() =>
    authStorage.readActiveView()
  );
  const [loginPhase, setLoginPhase] = useState<LoginPhase>('waiting');
  const [qrRevision, setQrRevision] = useState(() => Date.now());

  const scanTimerRef = useRef<number | null>(null);
  const confirmTimerRef = useRef<number | null>(null);

  const clearTimers = useCallback(() => {
    if (scanTimerRef.current) {
      window.clearTimeout(scanTimerRef.current);
      scanTimerRef.current = null;
    }

    if (confirmTimerRef.current) {
      window.clearTimeout(confirmTimerRef.current);
      confirmTimerRef.current = null;
    }
  }, []);

  const refreshQr = useCallback(() => {
    clearTimers();
    setLoginPhase('waiting');
    setQrRevision(Date.now());
  }, [clearTimers]);

  const finalizeLogin = useCallback(() => {
    setIsAuthenticated(true);
    setActiveView('portal');
    authStorage.saveIsAuthenticated(true);
    authStorage.saveActiveView('portal');
    scanTimerRef.current = null;
    confirmTimerRef.current = null;
  }, []);

  const simulateScan = useCallback(() => {
    clearTimers();
    setLoginPhase('scanning');

    scanTimerRef.current = window.setTimeout(() => {
      setLoginPhase('authenticated');

      confirmTimerRef.current = window.setTimeout(() => {
        finalizeLogin();
      }, 600);
    }, 900);
  }, [clearTimers, finalizeLogin]);

  const enterOperationInterface = useCallback(() => {
    setActiveView('operation');
    authStorage.saveActiveView('operation');
  }, []);

  const backToPortal = useCallback(() => {
    setActiveView('portal');
    authStorage.saveActiveView('portal');
  }, []);

  const handleLogout = useCallback(() => {
    clearTimers();
    setIsAuthenticated(false);
    setActiveView('portal');
    setLoginPhase('waiting');
    setQrRevision(Date.now());
    authStorage.clear();
  }, [clearTimers]);

  useEffect(() => {
    return () => clearTimers();
  }, [clearTimers]);

  return {
    isAuthenticated,
    activeView,
    loginPhase,
    qrRevision,
    actions: {
      refreshQr,
      simulateScan,
      enterOperationInterface,
      backToPortal,
      handleLogout,
    },
  };
};

