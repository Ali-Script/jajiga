i wrote code to give me info of last five month added villad and booked villas in this 2 variable

lastFiveMonthAddedVillasCount

lastFiveMonthBookedReserve

but my code return this response:

"lastFiveMonthAddedVillasCount": {

    "5": 5,

        "6": 1,

            "7": 1

},

"lastFiveMonthBookedReserve": {

    "7": 1

},

but i want get this response:

lastFiveMonthAddedVillasCount = [

    { month: 3, villasCount: 0 },
    { month: 4, villasCount: 0 },
    { month: 5, villasCount: 5 },
    { month: 6, villasCount: 1 },
    { month: 7, villasCount: 1 },
],

    lastFiveMonthBookedReserve = [
        { month: 3, villasCount: 0 },
        { month: 4, villasCount: 0 },
        { month: 5, villasCount: 0 },
        { month: 6, villasCount: 0 },
        { month: 7, villasCount: 1 },

    ],