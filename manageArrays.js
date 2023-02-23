const sortByDateAsc = (array) => {
    if (array.length < 2) return;
    array.sort((session1, session2) => {
        if (session1.date.ms > session2.date.ms)
            return 1;
        if (session1.date.ms < session2.date.ms)
            return -1;
        return 0;
    });
}
const sortByDateDesc = (array) => {
    if (array.length < 2) return;
    array.sort((session1, session2) => {
        if (session1.date.ms > session2.date.ms)
            return -1;
        if (session1.date.ms < session2.date.ms)
            return 1;
        return 0;
    });
}
const sortDataAsc = (array) => {
    if (array.length < 2) return;
    
    array.sort((string1, string2) => {
        string1 = string1.replace(/[^a-zA-Z ]/g, "").toLowerCase();
        string2 = string2.replace(/[^a-zA-Z ]/g, "").toLowerCase();
        if (string1 > string2)
            return 1;
        if (string1 < string2)
            return -1;
        return 0;
    });
}
const sortDataDesc = (array) => {
    if (array.length < 2) return;

    array.sort((string1, string2) => {
        string1 = string1.replace(/[^a-zA-Z ]/g, "").toLowerCase();
        string2 = string2.replace(/[^a-zA-Z ]/g, "").toLowerCase();
        if (string1 > string2)
            return -1;
        if (string1 < string2)
            return 1;
        return 0;
    });
}

const getNextSiblings = (element) => {
    let array = [];
    let nextSibling = element.nextElementSibling;

    while (nextSibling)
    {
        array.push(nextSibling)
        nextSibling = nextSibling.nextElementSibling;
    }
    return array;
}