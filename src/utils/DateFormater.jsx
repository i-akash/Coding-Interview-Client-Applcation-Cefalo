const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun",
    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
];


export const isToday = (date) => {
    let now = new Date();
    if (date.getDate() === now.getDate() && date.getMonth() === now.getMonth() && date.getFullYear() === now.getFullYear())
        return true
    return false
}

export function formatDate(d) {
    let date = new Date(d);
    let time = `${date.getHours()}: ${date.getMinutes()}`
    let formatedDate = "Today"

    if (!isToday(date))
        formatedDate = `${date.getDate()} ${monthNames[date.getMonth()]} ${date.getFullYear()}`

    return `${formatedDate}  ${time}`
}