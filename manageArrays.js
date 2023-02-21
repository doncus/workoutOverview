const sortByDateAsc = (array) => {
    array.sort((session1, session2) => {
        if (session1.date.ms > session2.date.ms)
            return 1;
        if (session1.date.ms < session2.date.ms)
            return -1;
    });
}
const sortByDateDesc = (array) => {
    array.sort((session1, session2) => {
        if (session1.date.ms > session2.date.ms)
            return -1;
        if (session1.date.ms < session2.date.ms)
            return 1;
    });
}