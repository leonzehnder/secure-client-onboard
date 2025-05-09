
import { OnboardingStage } from './index';

export const onboardingStages: OnboardingStage[] = [
  'application',
  'documents_pending',
  'verification',
  'compliance_check',
  'approved',
  'rejected'
];

export const getOnboardingStageLabel = (stage?: OnboardingStage): string => {
  switch (stage) {
    case 'application':
      return 'Application Submitted';
    case 'documents_pending':
      return 'Documents Pending';
    case 'verification':
      return 'Verification in Progress';
    case 'compliance_check':
      return 'Compliance Check';
    case 'approved':
      return 'Approved';
    case 'rejected':
      return 'Rejected';
    default:
      return 'Unknown';
  }
};

export const getOnboardingStageColor = (stage?: OnboardingStage): string => {
  switch (stage) {
    case 'application':
      return 'bg-blue-500';
    case 'documents_pending':
      return 'bg-yellow-500';
    case 'verification':
      return 'bg-orange-500';
    case 'compliance_check':
      return 'bg-purple-500';
    case 'approved':
      return 'bg-green-500';
    case 'rejected':
      return 'bg-red-500';
    default:
      return 'bg-gray-500';
  }
};
