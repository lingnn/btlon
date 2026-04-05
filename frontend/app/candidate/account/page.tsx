'use client';

import { CandidateAccount } from '@/components/candidate-account';
import { ProtectedRoute } from '@/components/protected-route';

export default function CandidateAccountPage() {
  return (
    <ProtectedRoute requiredRole="candidate">
      <CandidateAccount />
    </ProtectedRoute>
  );
}
