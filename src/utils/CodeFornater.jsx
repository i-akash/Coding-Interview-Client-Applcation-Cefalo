let jsTemplate =
    `
let solve=(input)=>{
    // write your solution here ...

    
}


solve(input)
`

let pyTemplate =
    `
def solve(input):
    # write your solution here


    return 1


`

export const getJsTemplate = (inputConstraint) => {
    return jsTemplate.replace(/input/g, Object.keys(inputConstraint).join(','))
}

export const getPyTemplate = (inputConstraint) => {
    return pyTemplate.replace(/input/g, Object.keys(inputConstraint).join(','))
}