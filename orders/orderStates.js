const orderStates = {
    created: 0,
    inProgress: 1,
    delivering: 2,
    late: 3,
    delivered: 4,
    canceled: 5
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