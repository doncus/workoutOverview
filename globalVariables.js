const contentFront = document.querySelector(".content-front");
const contentBack = document.querySelector(".content-back");
const addSessionButton = contentFront.querySelector(".add-session-button");

let messaging = false;
let weightOfLastSession = "";
let repsOfLastSession = "";
let nrSetsOfLastSession = "";
let lastValue = "";
let lastExercise = undefined;
let exerciseBeforeYear = undefined;
let exerciseBeforeMonth = undefined;
let latestDate = new Date().getFullYear();
let averageReps = 0;
let maxRepsOfExercise = 0;
let minRepsOfExercise = 9999;
let maxWeightOfExercise = 0;
let minWeightOfExercise = 9999;
let exerciseCounter = 0;
let allOfExercise = [];
let yearOfExercise = [];
let monthOfExercise = [];

// let exercises = [];
let exercises = [
    "Diamond-push-ups",
    "Pull-ups",
    "Face-pull",
    "Rows",
    "Dips",
    "Squats",
    "Biceps-curls",
    "Hip-thrusts",
    "Bulgarian-split-squats",
    "Leg-curls",
    "Walking-lunges",
    "Step-ups",
    "Calf-raises",
    "Lat-pulldown",
    "Cable-fly",
    "Triceps-cable",
    "Biceps-cable",
    "Shoulder-press",
    "Lateral-raises",
    "Concentration-curls",
    "Hammer-curls",
    "Push-ups",
    "Wide-push-ups",
    "Archer-push-ups",
    "One-handed-push-ups",
    "Wide-pull-ups",
    "Narrow-pull-ups",
    "Bench-press",
];