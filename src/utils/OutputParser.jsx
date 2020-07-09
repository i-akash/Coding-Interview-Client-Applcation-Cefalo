export const combineInputResult = (testcases = [], result = []) => {
    return testcases.map((test, index) => {
        let status = {}
        status.input = test.input
        status.output = result[index]

        if (Array.isArray(status.output))
            status.output = status.output.join(' ')
        else if (typeof status.output === 'object')
            status.output = JSON.stringify(status.output)
        else
            status.output = status.output.toString()
        console.log(status.output, test.output);

        status.accepted = status.output === test.output
        return status
    })
}