/* eslint-disable func-names, prefer-arrow-callback */
import {
  getMachineStateNameAt,
  getChannelFlowName,
  getChannelFlowStepName,
  getChannelFlowStepId,
  getIsChannelFlowStep,
  getIsQuestionStep,
  getIsChannelStep,
  getIsSelectChannelStep,
  getIsDoneStep,
  getIsInitializing,
  getIsIdle,
  getChannelFlowStepStateNode,
  getHasStepActionType,
  getHasPrevStep,
  getHasNextStep,
  getCurrentMachineStateName
} from './selectors';

import {
  CHANNELFLOW_STEP_QUESTION,
  CHANNELFLOW_STEP_SELECT_CHANNEL,
  CHANNELFLOW_STEP_CHANNEL,
  CHANNELFLOW_STEP_DONE,
  CHANNELFLOW_INIT,
  CHANNELFLOW_IDLE
} from '../../constants/statechart';
import { actionTypes } from '../../actions/channelFlow';

describe('state.reducers.machine.selectors', function () {
  describe('getMachineStateNameAt(state, level)', function () {
    describe('when current machine value is a string, hence, at level 0', function () {
      const state = {
        machine: {
          value: 'initializingFlow'
        }
      };
      it('should return an empty string when the level argument passed is below the minimum level, 0', function () {
        expect(getMachineStateNameAt(state, -1)).toEqual('');
      });
      it('should return an empty string when the level argument is above the max level, 0', function () {
        expect(getMachineStateNameAt(state, 1)).toEqual('');
      });
      it(`should return ${state.machine.value}, the current state, when passed a level 0`, function () {
        expect(getMachineStateNameAt(state, 0)).toEqual(state.machine.value);
      });
    });
    describe('when the current machine value is a object with a property that is an object with a property that is a string, having level 0, 1, and 2', function () {
      const flowName = 'flow1';
      const stepName = 'step1';

      const currentState = 'inStep';
      const state = {
        machine: {
          value: { [flowName]: { [stepName]: currentState } }
        }
      };
      it('should return an empty string when the level argument passed is below the minimum level, 0', function () {
        expect(getMachineStateNameAt(state, -1)).toEqual('');
      });
      it('should return an empty string when the level argument passed is above the max level, 3', function () {
        expect(getMachineStateNameAt(state, 3)).toEqual('');
      });
      it(`should return ${flowName} when passed a level above 1`, function () {
        expect(getMachineStateNameAt(state, 0)).toEqual(flowName);
      });
      it(`should return ${stepName} when passed a level above 2`, function () {
        expect(getMachineStateNameAt(state, 1)).toEqual(stepName);
      });
      it(`should return ${currentState} when passed a level above 2`, function () {
        expect(getMachineStateNameAt(state, 2)).toEqual(currentState);
      });
    });
  });

  describe('getCurrentMachineStateName(state)', function () {
    describe('when current machine value is a string, hence, at level 0', function () {
      const currentState = 'initializingFlow';
      const state = {
        machine: {
          value: currentState
        }
      };
      it(`should return the machine value ${currentState}`, function () {
        expect(getCurrentMachineStateName(state)).toEqual(currentState);
      });
    });
    describe('when the current machine value is a object with a property that is an object with a property that is a string, having level 0, 1, and 2', function () {
      const flowName = 'flow1';
      const stepName = 'step1';

      const currentState = 'inStep';
      const state = {
        machine: {
          value: { [flowName]: { [stepName]: currentState } }
        }
      };
      it(`should return the machine value ${currentState}`, function () {
        expect(getCurrentMachineStateName(state)).toEqual(currentState);
      });
    });
  });
  describe('getChannelFlowName(state)', function () {
    describe('when the current machine value is a object with a property that is an object with a property that is a string', function () {
      const flowName = 'flow1';
      const stepName = 'step1';

      const currentState = 'inStep';
      const state = {
        machine: {
          value: { [flowName]: { [stepName]: currentState } }
        }
      };
      it(`should return the flow name ${flowName}`, function () {
        expect(getChannelFlowName(state)).toEqual(flowName);
      });
    });
    describe('when the current machine value is a string', function () {
      const flowName = 'flow1';
      const state = {
        machine: {
          value: flowName
        }
      };
      it(`should return the flow name ${flowName}`, function () {
        expect(getChannelFlowName(state)).toEqual(flowName);
      });
    });
  });

  describe('getChannelFlowStepName(state)', function () {
    describe('when the current machine value is a object with a property that is an object with a property that is a string', function () {
      const flowName = 'flow1';
      const stepName = 'step1';

      const currentState = 'inStep';
      const state = {
        machine: {
          value: { [flowName]: { [stepName]: currentState } }
        }
      };
      it(`should return the step name ${stepName}`, function () {
        expect(getChannelFlowStepName(state)).toEqual(stepName);
      });
    });
    describe('when the current machine value is an object with a string property', function () {
      const flowName = 'flow1';
      const stepName = 'step1';

      const state = {
        machine: {
          value: { [flowName]: stepName }
        }
      };
      it(`should return the step name ${stepName}`, function () {
        expect(getChannelFlowStepName(state)).toEqual(stepName);
      });
    });
  });

  describe('getChannelFlowStepId(state)', function () {
    describe('when the current machine value is a object with a property that is an object with a property that is a string', function () {
      const flowName = 'flow1';
      const stepName = 'step1';
      const key = 'contactUs';
      const currentState = 'inStep';
      const stepId = `${key}.${flowName}.${stepName}`;
      const machine = {
        key
      };
      const state = {
        machine: {
          value: { [flowName]: { [stepName]: currentState } }
        }
      };
      it(`should return the stepID ${stepId}`, function () {
        expect(getChannelFlowStepId(machine)(state)).toEqual(stepId);
      });
    });
    describe('when the current machine value is a object with a property that is a string', function () {
      const flowName = 'flow1';
      const stepName = 'step1';
      const key = 'constactUs';
      const stepId = `${key}.${flowName}.${stepName}`;
      const machine = {
        key
      };
      const state = {
        machine: {
          value: { [flowName]: stepName }
        }
      };
      it(`should return the step ID ${stepId}`, function () {
        expect(getChannelFlowStepId(machine)(state)).toEqual(stepId);
      });
    });
    describe('when the current machine value is a string', function () {
      const flowName = 'flow1';
      const key = 'contactUs';
      const state = {
        machine: {
          value: flowName
        }
      };
      const machine = {
        key
      };
      it('should return an empty string', function () {
        expect(getChannelFlowStepId(machine)(state)).toEqual('');
      });
    });
  });

  describe('getIsChannelFlowStep(state, stepName)', function () {
    const stepName = 'step1';

    describe('when the current machine value is a object with a property that is an object with a property that is a string', function () {
      const flowName = 'flow1';
      const currentState = 'inStep';
      const state = {
        machine: {
          value: { [flowName]: { [stepName]: currentState } }
        }
      };
      it(`should return true when the step name ${stepName} matches`, function () {
        expect(getIsChannelFlowStep(state, stepName)).toEqual(true);
      });
      it('should return false when the step name does not match', function () {
        expect(getIsChannelFlowStep(state, 'otherStep')).toEqual(false);
      });
    });
    describe('when the current machine value is a object with a property that is a string', function () {
      const flowName = 'flow1';
      const state = {
        machine: {
          value: { [flowName]: stepName }
        }
      };
      it(`should return true when the step name ${stepName} matches`, function () {
        expect(getIsChannelFlowStep(state, stepName)).toEqual(true);
      });
      it('should return false when the step name does not match', function () {
        expect(getIsChannelFlowStep(state, 'otherStep')).toEqual(false);
      });
    });
    describe('when the current machine value is a string', function () {
      const flowName = 'flow1';
      const state = {
        machine: {
          value: flowName
        }
      };
      it('should return false', function () {
        expect(getIsChannelFlowStep(state, stepName)).toEqual(false);
      });
    });
  });

  [
    { name: CHANNELFLOW_STEP_QUESTION, selector: getIsQuestionStep },
    { name: CHANNELFLOW_STEP_CHANNEL, selector: getIsChannelStep },
    { name: CHANNELFLOW_STEP_SELECT_CHANNEL, selector: getIsSelectChannelStep },
    { name: CHANNELFLOW_STEP_DONE, selector: getIsDoneStep }
  ].forEach(function (step) {
    describe(`${step.selector.name}(state)`, function () {
      describe('when the current machine value is a object with a property that is an object with a property that is a string', function () {
        const flowName = 'flow1';
        const currentState = 'inStep';
        it(`should return true when the step name ${step.name} matches`, function () {
          const state = {
            machine: {
              value: { [flowName]: { [step.name]: currentState } }
            }
          };
          expect(step.selector(state)).toEqual(true);
        });
        it(`should return false when the step name does not match ${step.name}`, function () {
          const state = {
            machine: {
              value: { [flowName]: { nonMatchingStep: currentState } }
            }
          };
          expect(step.selector(state)).toEqual(false);
        });
      });
    });
  });

  [
    { name: CHANNELFLOW_INIT, selector: getIsInitializing },
    { name: CHANNELFLOW_IDLE, selector: getIsIdle }
  ].forEach(function (flow) {
    describe(`${flow.selector.name}(state)`, function () {
      it(`should return true when the flow state matches ${flow.name}`, function () {
        const state = {
          machine: {
            value: flow.name
          }
        };
        expect(flow.selector(state)).toEqual(true);
      });
      it('should return false when the flow state does not match', function () {
        const state = {
          machine: {
            value: 'nonMatchingFlowState'
          }
        };
        expect(flow.selector(state)).toEqual(false);
      });
    });
  });

  describe('getChannelFlowStepStateNode(machine)(state)', function () {
    const flowName = 'flow1';
    const stepName = 'step1';
    const key = 'contactUs';

    describe('when passed a state that has a step state', function () {
      const machineStateNode = { on: { [actionTypes.STEP_NEXT]: 'SomeState' } };
      const machine = {
        key,
        idMap: { [`${key}.${flowName}.${stepName}`]: machineStateNode }
      };
      const state = {
        machine: {
          value: { [flowName]: stepName }
        }
      };
      it('should return the expect machineStateNode', function () {
        expect(getChannelFlowStepStateNode(machine)(state)).toEqual(machineStateNode);
      });
    });
    describe('when passed a state that does not have a step state', function () {
      const machine = {
        key,
        idMap: {}
      };
      const state = {
        machine: {
          value: 'someState'
        }
      };
      it('should return undefined', function () {
        expect(getChannelFlowStepStateNode(machine)(state)).toBeNull();
      });
    });
    describe('when step state exists and machine state node is null', function () {
      const machineStateNode = { on: { [actionTypes.STEP_NEXT]: 'SomeState' } };
      const machine = {
        key,
        getState: jest.fn().mockReturnValue(machineStateNode)
      };
      const state = {
        machine: {
          value: { [flowName]: stepName }
        }
      };
      it('should return false', function () {
        expect(getHasPrevStep(machine)(state)).toEqual(false);
      });
    });
  });

  describe('getHasStepActionType(machine, actionType)(state)', function () {
    const flowName = 'flow1';
    const stepName = 'step1';
    const key = 'contactUs';

    describe(`when step state exists and machine state node has action type ${actionTypes.STEP_NEXT} `, function () {
      const machineStateNode = { on: { [actionTypes.STEP_NEXT]: 'SomeState' } };
      const machine = {
        key,
        idMap: { [`${key}.${flowName}.${stepName}`]: machineStateNode }
      };
      const state = {
        machine: {
          value: { [flowName]: stepName }
        }
      };
      it('should return true', function () {
        expect(getHasStepActionType(machine, actionTypes.STEP_NEXT)(state)).toEqual(true);
      });
    });
    describe(`when step state exists and machine state node does not have action type ${actionTypes.STEP_NEXT}`, function () {
      const machineStateNode = { on: { [actionTypes.STEP_PREV]: 'SomeState' } };
      const machine = {
        key,
        idMap: { [`${key}.${flowName}.${stepName}`]: machineStateNode }
      };
      const state = {
        machine: {
          value: { [flowName]: stepName }
        }
      };
      it('should return false', function () {
        expect(getHasStepActionType(machine, actionTypes.STEP_NEXT)(state)).toEqual(false);
      });
    });
    describe('when step state exists and machine state is null', function () {
      const machine = {
        key,
        idMap: { [`${key}.${flowName}.${stepName}`]: null }

      };
      const state = {
        machine: {
          value: { [flowName]: stepName }
        }
      };
      it('should return false', function () {
        expect(getHasStepActionType(machine, actionTypes.STEP_NEXT)(state)).toEqual(false);
      });
    });
    describe('when step state exists and machine state node does not have an on property', function () {
      const machineStateNode = {};
      const machine = {
        key,
        idMap: { [`${key}.${flowName}.${stepName}`]: machineStateNode }
      };
      const state = {
        machine: {
          value: { [flowName]: stepName }
        }
      };
      it('should return false', function () {
        expect(getHasStepActionType(machine, actionTypes.STEP_NEXT)(state)).toEqual(false);
      });
    });
  });

  describe('getHasPrevStep(machine)(state)', function () {
    const flowName = 'flow1';
    const stepName = 'step1';
    const key = 'contactUs';

    describe(`when step state exists and machine state node has action type ${actionTypes.STEP_PREV} `, function () {
      const machineStateNode = { on: { [actionTypes.STEP_PREV]: 'SomeState' } };
      const machine = {
        key,
        idMap: { [`${key}.${flowName}.${stepName}`]: machineStateNode }
      };
      const state = {
        machine: {
          value: { [flowName]: stepName }
        }
      };
      it('should return true', function () {
        expect(getHasPrevStep(machine)(state)).toEqual(true);
      });
    });
    describe(`when step state exists and machine state node does not have action type ${actionTypes.STEP_PREV}`, function () {
      const machineStateNode = { on: { [actionTypes.STEP_NEXT]: 'SomeState' } };
      const machine = {
        key,
        idMap: { [`${key}.${flowName}.${stepName}`]: machineStateNode }
      };
      const state = {
        machine: {
          value: { [flowName]: stepName }
        }
      };
      it('should return false', function () {
        expect(getHasPrevStep(machine)(state)).toEqual(false);
      });
    });
  });

  describe('getHasNextStep(machine)(state)', function () {
    const flowName = 'flow1';
    const stepName = 'step1';
    const key = 'contactUs';

    describe(`when step state exists and machine state node has action type ${actionTypes.STEP_NEXT} `, function () {
      const machineStateNode = { on: { [actionTypes.STEP_NEXT]: 'SomeState' } };
      const machine = {
        key,
        idMap: { [`${key}.${flowName}.${stepName}`]: machineStateNode }
      };
      const state = {
        machine: {
          value: { [flowName]: stepName }
        }
      };
      it('should return true', function () {
        expect(getHasNextStep(machine)(state)).toEqual(true);
      });
    });
    describe(`when step state exists and machine state node does not have action type ${actionTypes.STEP_NEXT}`, function () {
      const machineStateNode = { on: { [actionTypes.STEP_PREV]: 'SomeState' } };
      const machine = {
        key,
        idMap: { [`${key}.${flowName}.${stepName}`]: machineStateNode }
      };
      const state = {
        machine: {
          value: { [flowName]: stepName }
        }
      };
      it('should return false', function () {
        expect(getHasNextStep(machine)(state)).toEqual(false);
      });
    });
  });
});
