/**
 * Badge Utilities
 * Shared badge/label formatting for care events
 */

/**
 * Get human-readable badge for grief support stage
 * @param {string} stage - Stage identifier (e.g., '1_week', '1_month')
 * @returns {string} Human-readable badge text
 */
export const getGriefStageBadge = (stage) => {
  const badges = {
    '1_week': 'Week 1',
    '2_weeks': 'Week 2',
    '1_month': 'Month 1',
    '3_months': 'Month 3',
    '6_months': 'Month 6',
    '1_year': 'Year 1'
  };
  return badges[stage] || formatStageLabel(stage);
};

/**
 * Get human-readable badge for accident follow-up stage
 * @param {string} stage - Stage identifier
 * @returns {string} Human-readable badge text
 */
export const getAccidentStageBadge = (stage) => {
  const badges = {
    'first_followup': 'First Follow-up',
    'second_followup': 'Second Follow-up',
    'third_followup': 'Third Follow-up',
    'final_check': 'Final Check'
  };
  return badges[stage] || formatStageLabel(stage);
};

/**
 * Format stage label from snake_case to Title Case
 * @param {string} stage - Snake case stage name
 * @returns {string} Title cased label
 */
const formatStageLabel = (stage) => {
  if (!stage) return '';
  return stage
    .replace(/_/g, ' ')
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};

/**
 * Get badge color class based on event type
 * @param {string} eventType - Event type identifier
 * @returns {{ bg: string, text: string }} Tailwind class names
 */
export const getEventTypeBadgeColors = (eventType) => {
  const celebrationTypes = ['birthday', 'childbirth', 'new_house'];
  const careTypes = ['grief_loss', 'accident_illness', 'hospital_visit'];
  const aidTypes = ['financial_aid'];

  if (celebrationTypes.includes(eventType)) {
    return { bg: 'bg-amber-100', text: 'text-amber-800' };
  } else if (careTypes.includes(eventType)) {
    return { bg: 'bg-pink-100', text: 'text-pink-800' };
  } else if (aidTypes.includes(eventType)) {
    return { bg: 'bg-purple-100', text: 'text-purple-800' };
  }
  return { bg: 'bg-teal-100', text: 'text-teal-800' };
};

/**
 * Get engagement status badge styling
 * @param {string} status - Engagement status
 * @returns {{ bg: string, text: string, label: string }}
 */
export const getEngagementBadge = (status) => {
  switch (status) {
    case 'active':
      return { bg: 'bg-green-100', text: 'text-green-800', label: 'Active' };
    case 'at_risk':
      return { bg: 'bg-yellow-100', text: 'text-yellow-800', label: 'At Risk' };
    case 'disconnected':
      return { bg: 'bg-red-100', text: 'text-red-800', label: 'Disconnected' };
    default:
      return { bg: 'bg-gray-100', text: 'text-gray-800', label: status };
  }
};
