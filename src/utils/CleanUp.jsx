export const cleanSpaceNnewLine = (text) => {
    text = text.replace(/^\s+|\s+$/g, "");
    text = text.replace(/\n+/g, " ");
    text = text.replace(/\s+/g, " ")

    return text
}