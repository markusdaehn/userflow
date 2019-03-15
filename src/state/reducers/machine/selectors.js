import {
  CHANNELFLOW_STEP_QUESTION,
  CHANNELFLOW_STEP_CHANNEL,
  CHANNELFLOW_STEP_SELECT_CHANNEL,
  CHANNELFLOW_STEP_AUDIT_SUPPORT,
  CHANNELFLOW_STEP_SUBMISSION_INVALID,
  CHANNELFLOW_STEP_DONE,
  CHANNELFLOW_INIT,
  CHANNELFLOW_IDLE,
  CHANNELFLOW_START,
  CHANNELFLOW_STEP_IDLE
} from '../../constants/statechart';
import { actionTypes } from '../../actions/channelFlow';
import { THIRD_SEARCH_ARTICLE_VIEW, SECOND_SEARCH_ARTICLE_VIEW } from '../../../components/SearchView/constants';

const getMachineStateName = function getMachineStateName(machineStateValue) {
  if (!machineStateValue) return '';
  return typeof machineStateValue === 'string' ? machineStateValue : Object.keys(machineStateValue)[0];
};

const getNextMachineStateValue = function getNextMachineStateValue(machineStateValue) {
  if (!machineStateValue || typeof machineStateValue === 'string') return undefined;

  return machineStateValue[Object.keys(machineStateValue)[0]];
};

const getMachineStateValue = function getMachineStateValue(state) {
  return state.machine && state.machine.value;
};

export const getMachineStateNameAt = function getMachineStateNameAt(
  state,
  level
) {
  let name = '';
  let currentMachineStateValue = getMachineStateValue(state);
  let currentLevel = 0;
  if (level >= 0) {
    while (currentLevel <= level && currentMachineStateValue) {
      name = getMachineStateName(currentMachineStateValue);
      currentMachineStateValue = getNextMachineStateValue(currentMachineStateValue);
      currentLevel++;
    }
  }
  return level === currentLevel - 1 ? name : '';
};

export const getCurrentMachineStateName = function getCurrentMachineStateName(state) {
  let name = '';
  let currentMachineStateValue = getMachineStateValue(state);

  while (currentMachineStateValue) {
    name = getMachineStateName(currentMachineStateValue);
    currentMachineStateValue = getNextMachineStateValue(currentMachineStateValue);
  }

  return name;
};
export const getChannelStatechartKey = function getChannelStatechartKey(machine) {
  return machine.key;
};

export const getChannelFlowName = function getChannelFlow(state) {
  const CHANNELFLOW_MACHINE_STATE_LEVEL = 0;
  return getMachineStateNameAt(state, CHANNELFLOW_MACHINE_STATE_LEVEL);
};

export const getChannelFlowStepName = function getChannelFlowStep(state) {
  const CHANNELFLOW_STEP_MACHINE_STATE_LEVEL = 1;
  return getMachineStateNameAt(state, CHANNELFLOW_STEP_MACHINE_STATE_LEVEL);
};

export const getChannelFlowStepId = function getChannelFlowStepId(machine) {
  return (state) => {
    const key = getChannelStatechartKey(machine);
    const flow = getChannelFlowName(state);
    const step = getChannelFlowStepName(state);
    if (!flow || !step) return '';

    return `${key}.${flow}.${step}`;
  };
};

export const getIsChannelFlowStep = function getIsChannelFlowStep(state, stepName) {
  return getChannelFlowStepName(state) === stepName;
};

export const getIsQuestionStep = function getIsQuestionStep(state) {
  return getIsChannelFlowStep(state, CHANNELFLOW_STEP_QUESTION);
};

export const getIsSelectChannelStep = function getIsSelectChannelStep(state) {
  return getIsChannelFlowStep(state, CHANNELFLOW_STEP_SELECT_CHANNEL);
};

export const getIsChannelStep = function getIsChannelStep(state) {
  return getIsChannelFlowStep(state, CHANNELFLOW_STEP_CHANNEL);
};

export const getIsDoneStep = function getIsDoneStep(state) {
  return getIsChannelFlowStep(state, CHANNELFLOW_STEP_DONE);
};

export const getIsInitializing = function getIsInitializing(state) {
  return getMachineStateName(getMachineStateValue(state)) === CHANNELFLOW_INIT;
};

export const getHasStarted = function getHasStarted(state) {
  return getMachineStateName(getMachineStateValue(state)) !== CHANNELFLOW_START;
};

export const getIsInitialized = function getIsInitialized(state) {
  return getHasStarted(state) && !getIsInitializing(state);
};

export const getIsIdle = function getIsIdle(state) {
  return getMachineStateName(getMachineStateValue(state)) === CHANNELFLOW_IDLE;
};

export const getChannelFlowStepStateNode = function getChannelFlowStepStateNode(machine) {
  return (state) => {
    const stepId = getChannelFlowStepId(machine)(state);
    return stepId && machine.idMap ? machine.idMap[stepId] : null;
  };
};

export const getHasStepActionType = function getHasStepActionType(machine, actionType) {
  return (state) => {
    const stepStateNode = getChannelFlowStepStateNode(machine)(state);
    return !!(stepStateNode && stepStateNode.on && Object.keys(stepStateNode.on).includes(actionType));
  };
};

export const getHasPrevStep = function getHasPrevStep(machine) {
  return getHasStepActionType(machine, actionTypes.STEP_PREV);
};

export const getHasNextStep = function getHasNextStep(machine) {
  return getHasStepActionType(machine, actionTypes.STEP_NEXT);
};

export const getIsStepIdle = function getIsStepIdle(state) {
  return getCurrentMachineStateName(state) === CHANNELFLOW_STEP_IDLE;
};

export const getIsAuditSupport = function getIsAuditSupport(state) {
  return getCurrentMachineStateName(state) === CHANNELFLOW_STEP_AUDIT_SUPPORT;
};

export const getIsQuestionInvalidSubmissionStep = function getIsQuestionInvalidSubmissionStep(state) {
  return getCurrentMachineStateName(state) === CHANNELFLOW_STEP_SUBMISSION_INVALID;
};


/** Article view */

export const getIsArticleView = state => getIsChannelFlowStep(state, THIRD_SEARCH_ARTICLE_VIEW) || getIsChannelFlowStep(state, SECOND_SEARCH_ARTICLE_VIEW); //eslint-disable-line

export default {
  getMachineStateValue,
  getMachineStateNameAt,
  getChannelFlowName,
  getChannelFlowStepName,
  getChannelFlowStepId,
  getIsChannelFlowStep,
  getIsQuestionStep,
  getIsQuestionInvalidSubmissionStep,
  getIsSelectChannelStep,
  getIsChannelStep,
  getIsInitializing,
  getIsInitialized,
  getHasStarted,
  getIsIdle,
  getIsStepIdle,
  getIsAuditSupport,
  getChannelFlowStepStateNode,
  getHasStepActionType,
  getHasPrevStep,
  getHasNextStep
};
