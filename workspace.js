// let villas = [
//     {
//         aboutVilla: {
//             id: 1,
//             villaZone: "littoral",
//         },
//     },
//     {
//         aboutVilla: {
//             id: 2,
//             villaZone: "silvan",
//         },
//     },
//     {
//         aboutVilla: {
//             id: 3,
//             villaZone: "summerVilla",
//         },
//     },
//     {
//         aboutVilla: {
//             id: 4,
//             villaZone: "desertHouse",
//         },
//     },
//     {
//         aboutVilla: {
//             id: 5,
//             villaZone: "townHouse",
//         },
//     },
//     {
//         aboutVilla: {
//             id: 7,
//             villaZone: "cottage",
//         },
//     },
//     {
//         aboutVilla: {
//             id: 8,
//             villaZone: "townHouse",
//         },
//     },
//     {
//         aboutVilla: {
//             id: 9,
//             villaZone: "cottage",
//         },
//     },
// ]




// let allZoneWithVillas = {
//     littoral: {
//         cover: "littoral.webp",
//         count: null,
//     },
//     silvan: {
//         cover: "silvan.webp",
//         count: null,
//     },
//     summerVilla: {
//         cover: "summerVilla.webp",
//         count: null,
//     },
//     desertHouse: {
//         cover: "desertHouse.webp",
//         count: null,
//     },
//     townHouse: {
//         cover: "townHouse.webp",
//         count: null,
//     },
//     suburbanHouse: {
//         cover: "suburbanHouse.webp",
//         count: null,
//     },
//     cottage: {
//         cover: "cottage.webp",
//         count: null,
//     },
// }


// let ordredVillas = {
//     littoral: {
//         cover: "littoral.webp",
//         count: 1,
//     },
//     silvan: {
//         cover: "silvan.webp",
//         count: 1,
//     },
//     summerVilla: {
//         cover: "summerVilla.webp",
//         count: 1,
//     },
//     desertHouse: {
//         cover: "desertHouse.webp",
//         count: 1,
//     },
//     townHouse: {
//         cover: "townHouse.webp",
//         count: 2,
//     },
//     suburbanHouse: {
//         cover: "suburbanHouse.webp",
//         count: 0,
//     },
//     cottage: {
//         cover: "cottage.webp",
//         count: 2,
//     },
// }

// const villasByZone = villas.reduce((acc, villa) => {
//     const zone = villa.aboutVilla.villaZone;
//     acc[zone] = (acc[zone] || 0) + 1;
//     return acc;
// }, {});

// const sortedVillasByZone = Object.keys(villasByZone).sort((a, b) => villasByZone[b] - villasByZone[a]).reduce((acc, zone) => {
//     acc[zone] = {
//         cover: allZoneWithVillas[zone].cover,
//         count: villasByZone[zone] || 0,
//     };
//     return acc;
// }, {});







let orderedVillas = {
    littoral: {
        cover: "littoral.webp",
        count: 0
    },
    silvan: {
        cover: "silvan.webp",
        count: 10
    },
    summerVilla: {
        cover: "summerVilla.webp",
        count: 0
    },
    desertHouse: {
        cover: "desertHouse.webp",
        count: 2
    },
    townHouse: {
        cover: "townHouse.webp",
        count: 0
    },
    suburbanHouse: {
        cover: "suburbanHouse.webp",
        count: 0
    },
    cottage: {
        cover: "cottage.webp",
        count: 0
    }
}