import { ALL_PROBLEM, NEW_PROBLEM, REMOVED_PROBLEM } from "../types/Type";

export const allProblemAction = (problems) => ({
    type: ALL_PROBLEM,
    payload: problems
})


export const newProblemAction = (problem) => ({
    type: NEW_PROBLEM,
    payload: problem
})


export const removedProblemAction = (problem) => ({
    type: REMOVED_PROBLEM,
    payload: problem
})