const setInputValue = ({target}) => {
    inputValue = target.value;
}
const resetInputValue = (input) => {
    input.value = "";
}

const checkIfNumber = ({target}) => {
    target.value = target.value.replace(/[^0-9.]/g, '');
    if (target.value.replace(/[^.]/g, '').length > 1)
        target.value = target.value.replace('.', '');
}
const checkIfInteger = ({target}) => {
    target.value = target.value.replace(/[^0-9]/g, '');
    if (target.value.length > 1 && target.value.startsWith("0"))
        target.value = target.value.substring(1);
}
const checkIfTime = ({target}) => {
    target.value = target.value.replace(/[^0-9]/g, '');
    if (target.id === "hours" && target.value > 23)
        target.value = 23;
    else if (target.id === "minutes" && target.value > 59)
        target.value = 59;
}
const checkIfCharacters = ({target}) => {
    target.value = target.value.replace(/[^a-zA-Z -]/g, '');
}