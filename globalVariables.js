const contentFront = document.querySelector(".content-front");
const contentBack = document.querySelector(".content-back");
const addSessionButton = contentFront.querySelector(".add-session-button");

let weightOfLastSession = "";
let lastValue = "";
let repsOfLastSession = 0;
let nrSetsOfLastSession = 0;
let lastExercise = undefined;
let exerciseBeforeYear = undefined;
let exerciseBeforeMonth = undefined;
let latestDate = new Date().getFullYear();
let averageReps = 0;
let maxReps = 0;
let maxWeight = 0;
let exerciseCounter = 0;
let allOfExercise = [];
let yearOfExercise = [];
let monthOfExercise = [];

// let exercises = [];
let exercises = [
    "Air-squats", "Squats", "Hip-thrusts", "Bulgarian-split-squats", "Leg-curls",
    "Walking-lunges", "Step-ups", "Calf-raises", "Lat-pulldown", "Face-pull",
    "Rows", "Cable-fly", "Triceps-cable", "Biceps-cable", "Shoulder-press", 
    "Lateral-raises",
    "Biceps-curls", "Concentration-curls", "Hammer-curls", "Twisting-curls",
    "Push-ups", "Diamond-push-ups", "Wide-push-ups", "Archer-push-ups",
    "Pull-ups", "Wide-pull-ups", "Narrow-pull-ups", "Bench-press", "Dips"
];