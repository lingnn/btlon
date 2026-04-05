'use client';

import { CandidatePortal } from '@/components/candidate-portal';
import { ProtectedRoute } from '@/components/protected-route';

export default function CandidatePage() {
  return (
    <ProtectedRoute requiredRole="candidate">
      <CandidatePortal />
    </ProtectedRoute>
  );
}
