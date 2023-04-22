const orderStates = {
    inProgress: "In progress",
    delivering: "Delivering",
    delivered: "Delivered",
    late: "Late",
    inProgressNumber: 0,
    deliveringNumber: 1,
    lateNumber: 2,
    deliveredNumber: 3
};
const orderStatesList = [
    "In progress",
    "Delivering",
    "Late",
    "Delivered"
];

module.exports = { 
    orderStates,
    orderStatesList
}