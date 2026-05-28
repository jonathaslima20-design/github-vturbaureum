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
    const isCorretor = user.role === 'corretor';

    if (isAdmin || isParceiro || !isCorretor || isFreePlan) {
      if (isForced) {
        setForced(false);
        closeModal();
      }
      return;
    }

    if (isSuspended && !isOpen) {
      openModal(true);
      setForced(true);
    }

    if (isExpired && !isOpen) {
      openModal(true);
      setForced(true);
    }

    if (!hasActivePlan && !isExpired && !isSuspended && !isOpen) {
      openModal(true);
      setForced(true);
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
