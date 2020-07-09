import { ALL_SOLUTION, NEW_SOLUTION, REMOVE_ALL_SOLUTION } from "../types/Type";

export const allSolutionAction = (solutions) => ({
    type: ALL_SOLUTION,
    payload: solutions
})


export const newSolutionAction = (solution) => ({
    type: NEW_SOLUTION,
    payload: solution
})


export const removeAllSolutionAction = () => ({
    type: REMOVE_ALL_SOLUTION,
    payload: {}
})