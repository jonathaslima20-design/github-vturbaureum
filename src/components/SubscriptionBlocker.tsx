import { useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useSubscriptionModal } from '@/contexts/SubscriptionModalContext';
import SubscriptionModal from '@/components/subscription/SubscriptionModal';

export default function SubscriptionBlocker() {
  const { user, loading } = useAuth();
  const { isOpen, isForced, limitReason, setForced, openModal, closeModal } = useSubscriptionModal();

  useEffect(() => {
    if (loading || !user) return;

    const isAdmin = user.role === 'admin';
    const isParceiro = user.role === 'parceiro';
    const hasActivePlan = user.plan_status === 'active';
    const isFreePlan = user.plan_status === 'free';
    const isExpired = user.plan_status === 'expired';
    const isSuspended = user.plan_status === 'suspended';

    // Admins and parceiros never get blocked
    if (isAdmin || isParceiro) {
      if (isForced) {
        setForced(false);
        closeModal();
      }
      return;
    }

    // Free plan users can open the modal voluntarily — never force-close it
    if (isFreePlan) return;

    if (isSuspended && !isOpen) {
      openModal(true);
      setForced(true);
      return;
    }

    if (isExpired && !isOpen) {
      openModal(true);
      setForced(true);
      return;
    }

    if (!hasActivePlan && !isExpired && !isSuspended && !isOpen) {
      openModal(true);
      setForced(true);
      return;
    }

    if (hasActivePlan && isForced) {
      closeModal();
      setForced(false);
    }
  }, [user, loading, isOpen, isForced, setForced, openModal, closeModal]);

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
