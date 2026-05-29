import { useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useSubscriptionModal } from '@/contexts/SubscriptionModalContext';
import SubscriptionModal from '@/components/subscription/SubscriptionModal';

export default function SubscriptionBlocker() {
  const { user, loading } = useAuth();
  const { isOpen, isForced, limitReason, setForced, openModal, closeModal, forceClose } = useSubscriptionModal();

  useEffect(() => {
    if (loading || !user) return;

    const isAdmin = user.role === 'admin';
    const isParceiro = user.role === 'parceiro';
    const hasActivePlan = user.plan_status === 'active';
    const isFreePlan = user.plan_status === 'free';
    const isExpired = user.plan_status === 'expired';
    const isSuspended = user.plan_status === 'suspended';

    // Admins and parceiros are never blocked — clear any forced state
    if (isAdmin || isParceiro) {
      forceClose();
      return;
    }

    // Free plan: allow voluntary modal opens, never force anything
    if (isFreePlan) return;

    // Active plan: clear forced block if it was set
    if (hasActivePlan) {
      if (isForced) forceClose();
      return;
    }

    // Blocked states: force the modal open
    if ((isSuspended || isExpired || !hasActivePlan) && !isOpen) {
      openModal(true);
      setForced(true);
    }
  }, [user, loading]); // intentionally minimal — openModal/forceClose/setForced are stable

  return (
    <SubscriptionModal
      open={isOpen}
      onOpenChange={(open) => { if (!open) closeModal(); }}
      isForced={isForced}
      limitReason={limitReason}
      planStatus={user?.plan_status}
    />
  );
}
