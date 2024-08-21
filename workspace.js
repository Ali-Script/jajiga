// // let villas = [
// //     {
// //         aboutVilla: {
// //             id: 1,
// //             villaZone: "littoral",
// //         },
// //     },
// //     {
// //         aboutVilla: {
// //             id: 2,
// //             villaZone: "silvan",
// //         },
// //     },
// //     {
// //         aboutVilla: {
// //             id: 3,
// //             villaZone: "summerVilla",
// //         },
// //     },
// //     {
// //         aboutVilla: {
// //             id: 4,
// //             villaZone: "desertHouse",
// //         },
// //     },
// //     {
// //         aboutVilla: {
// //             id: 5,
// //             villaZone: "townHouse",
// //         },
// //     },
// //     {
// //         aboutVilla: {
// //             id: 7,
// //             villaZone: "cottage",
// //         },
// //     },
// //     {
// //         aboutVilla: {
// //             id: 8,
// //             villaZone: "townHouse",
// //         },
// //     },
// //     {
// //         aboutVilla: {
// //             id: 9,
// //             villaZone: "cottage",
// //         },
// //     },
// // ]




// // let allZone = [
// //     {
// //         title: "littoral",
// //         cover: "littoral.webp",
// //         persianTitle: "ویلا ساحلی",
// //         count: null
// //     },
// //     {
// //         title: "silvan",
// //         cover: "silvan.webp",
// //         persianTitle: "ویلا ییلاقی",
// //         count: null
// //     },
// //     {
// //         title: "summerVilla",
// //         cover: "summerVilla.webp",
// //         persianTitle: "اقامتگاه تابستانه",
// //         count: null
// //     },
// //     {
// //         title: "desertHouse",
// //         cover: "desertHouse.webp",
// //         persianTitle: "اقامتگاه صحرایی",
// //         count: null
// //     },
// //     {
// //         title: "townHouse",
// //         cover: "townHouse.webp",
// //         persianTitle: "ویلا شهری",
// //         count: null
// //     },
// //     {
// //         title: "cottage",
// //         cover: "cottage.webp",
// //         persianTitle: "کلبه چوبی جنگلی",
// //         count: null
// //     },
// //     {
// //         title: "suburbanHouse",
// //         cover: "suburbanHouse.webp",
// //         persianTitle: "ویلا حومه شهر",
// //         count: null
// //     },
// // ]


// // let ordredVillas = [
// //     {
// //         title: "littoral",
// //         cover: "littoral.webp",
// //         persianTitle: "ویلا ساحلی",
// //         count: 1
// //     },
// //     {
// //         title: "silvan",
// //         cover: "silvan.webp",
// //         persianTitle: "ویلا ییلاقی",
// //         count: 1
// //     },
// //     {
// //         title: "summerVilla",
// //         cover: "summerVilla.webp",
// //         persianTitle: "اقامتگاه تابستانه",
// //         count: 1
// //     },
// //     {
// //         title: "desertHouse",
// //         cover: "desertHouse.webp",
// //         persianTitle: "اقامتگاه صحرایی",
// //         count: 1
// //     },
// //     {
// //         title: "townHouse",
// //         cover: "townHouse.webp",
// //         persianTitle: "ویلا شهری",
// //         count: 2
// //     },
// //     {
// //         title: "suburbanHouse",
// //         cover: "suburbanHouse.webp",
// //         persianTitle: "ویلا حومه شهر",
// //         count: 0
// //     },
// //     {
// //         title: "cottage",
// //         cover: "cottage.webp",
// //         persianTitle: "کلبه چوبی جنگلی",
// //         count: 2
// //     },
// // ]



// // const villasByZone = villas.reduce((acc, villa) => {
// //     const zone = villa.aboutVilla.villaZone;
// //     acc[zone] = (acc[zone] || 0) + 1;
// //     return acc;
// // }, {});

// // const orderedVillas = allZone.map((zone) => ({
// //     ...zone,
// //     count: villasByZone[zone.title] || 0,
// // })).sort((a, b) => b.count - a.count);

// let allVillas = [
//     {
//         title: 1,
//         address: { state: "بابلسر", city: "چالوس" }
//     },
//     {
//         title: 2,
//         address: { state: "بابلسر", city: "چالوس" }
//     },
//     {
//         title: 3,
//         address: { state: "بابلسر", city: "فیلبند" }
//     }
// ]
// let city = [
//     {
//         title: "babolsar",
//         cover: "babolsar.webp",
//         persianTitle: "بابلسر",
//         count: null
//     },
//     {
//         title: "bandaranzali",
//         cover: "bandaranzali.webp",
//         persianTitle: "بندر انزلی",
//         count: null
//     },
//     {
//         title: "chalus",
//         cover: "chalus.webp",
//         persianTitle: "چالوس",
//         count: null
//     },
//     {
//         title: "filband",
//         cover: "filband.webp",
//         persianTitle: "فیلبند",
//         count: null
//     },
//     {
//         title: "fuman",
//         cover: "fuman.webp",
//         persianTitle: "فومن",
//         count: null
//     },
//     {
//         title: "gorgan",
//         cover: "gorgan.webp",
//         persianTitle: "گرگان",
//         count: null
//     },
//     {
//         title: "isfahan",
//         cover: "isfahan.webp",
//         persianTitle: "اصفهان",
//         count: null
//     },
//     {
//         title: "kelardasht",
//         cover: "kelardasht.webp",
//         persianTitle: "کلاردشت",
//         count: null
//     },
//     {
//         title: "kish",
//         cover: "kish.webp",
//         persianTitle: "کیش",
//         count: null
//     },
//     {
//         title: "kordan",
//         cover: "kordan.webp",
//         persianTitle: "کردان",
//         count: null
//     },
//     {
//         title: "lahijan",
//         cover: "lahijan.webp",
//         persianTitle: "لاهیجان",
//         count: null
//     },
//     {
//         title: "mahmudabad",
//         cover: "mahmudabad.webp",
//         persianTitle: "محمود آباد",
//         count: null
//     },
//     {
//         title: "masal",
//         cover: "masal.webp",
//         persianTitle: "ماسال",
//         count: null
//     },
//     {
//         title: "mashhad",
//         cover: "mashhad.webp",
//         persianTitle: "مشهد",
//         count: null
//     },
//     {
//         title: "motelqoo",
//         cover: "motelqoo.webp",
//         persianTitle: "متل قو",
//         count: null
//     },
//     {
//         title: "nowshahr",
//         cover: "nowshahr.webp",
//         persianTitle: "نوشهر",
//         count: null
//     },
//     {
//         title: "ramsar",
//         cover: "ramsar.webp",
//         persianTitle: "رامسر",
//         count: null
//     },
//     {
//         title: "rasht",
//         cover: "rasht.webp",
//         persianTitle: "رشت",
//         count: null
//     },
//     {
//         title: "sareyn",
//         cover: "sareyn.webp",
//         persianTitle: "سرعین",
//         count: null
//     },
//     {
//         title: "sari",
//         cover: "sari.webp",
//         persianTitle: "ساری",
//         count: null
//     },
//     {
//         title: "savadkuh",
//         cover: "savadkuh.webp",
//         persianTitle: "سواد کوه",
//         count: null
//     },
//     {
//         title: "shahriar",
//         cover: "shahriar.webp",
//         persianTitle: "شهریار",
//         count: null
//     },
//     {
//         title: "shiraz",
//         cover: "shiraz.webp",
//         persianTitle: "شیراز",
//         count: null
//     },
//     {
//         title: "tabriz",
//         cover: "tabriz.webp",
//         persianTitle: "تبریز",
//         count: null
//     },
//     {
//         title: "talesh",
//         cover: "talesh.webp",
//         persianTitle: "تالش",
//         count: null
//     },
//     {
//         title: "tehran",
//         cover: "tehran.webp",
//         persianTitle: "تهران",
//         count: null
//     },
// ]
// let sortedCity = [
//     {
//         title: "babolsar",
//         cover: "babolsar.webp",
//         persianTitle: "بابلسر",
//         count: 1
//     },
//     {
//         title: "bandaranzali",
//         cover: "bandaranzali.webp",
//         persianTitle: "بندر انزلی",
//         count: 0
//     },
//     {
//         title: "chalus",
//         cover: "chalus.webp",
//         persianTitle: "چالوس",
//         count: 2
//     },
//     {
//         title: "filband",
//         cover: "filband.webp",
//         persianTitle: "فیلبند",
//         count: 1
//     },
//     {
//         title: "fuman",
//         cover: "fuman.webp",
//         persianTitle: "فومن",
//         count: 0
//     },
//     {
//         title: "gorgan",
//         cover: "gorgan.webp",
//         persianTitle: "گرگان",
//         count: 0
//     },
//     {
//         title: "isfahan",
//         cover: "isfahan.webp",
//         persianTitle: "اصفهان",
//         count: 0
//     },
//     {
//         title: "kelardasht",
//         cover: "kelardasht.webp",
//         persianTitle: "کلاردشت",
//         count: 0
//     },
//     {
//         title: "kish",
//         cover: "kish.webp",
//         persianTitle: "کیش",
//         count: 0
//     },
//     {
//         title: "kordan",
//         cover: "kordan.webp",
//         persianTitle: "کردان",
//         count: 0
//     },
//     {
//         title: "lahijan",
//         cover: "lahijan.webp",
//         persianTitle: "لاهیجان",
//         count: 0
//     },
//     {
//         title: "mahmudabad",
//         cover: "mahmudabad.webp",
//         persianTitle: "محمود آباد",
//         count: 0
//     },
//     {
//         title: "masal",
//         cover: "masal.webp",
//         persianTitle: "ماسال",
//         count: 0
//     },
//     {
//         title: "mashhad",
//         cover: "mashhad.webp",
//         persianTitle: "مشهد",
//         count: 0
//     },
//     {
//         title: "motelqoo",
//         cover: "motelqoo.webp",
//         persianTitle: "متل قو",
//         count: 0
//     },
//     {
//         title: "nowshahr",
//         cover: "nowshahr.webp",
//         persianTitle: "نوشهر",
//         count: 0
//     },
//     {
//         title: "ramsar",
//         cover: "ramsar.webp",
//         persianTitle: "رامسر",
//         count: 0
//     },
//     {
//         title: "rasht",
//         cover: "rasht.webp",
//         persianTitle: "رشت",
//         count: 0
//     },
//     {
//         title: "sareyn",
//         cover: "sareyn.webp",
//         persianTitle: "سرعین",
//         count: 0
//     },
//     {
//         title: "sari",
//         cover: "sari.webp",
//         persianTitle: "ساری",
//         count: 0
//     },
//     {
//         title: "savadkuh",
//         cover: "savadkuh.webp",
//         persianTitle: "سواد کوه",
//         count: 0
//     },
//     {
//         title: "shahriar",
//         cover: "shahriar.webp",
//         persianTitle: "شهریار",
//         count: 0
//     },
//     {
//         title: "shiraz",
//         cover: "shiraz.webp",
//         persianTitle: "شیراز",
//         count: 0
//     },
//     {
//         title: "tabriz",
//         cover: "tabriz.webp",
//         persianTitle: "تبریز",
//         count: 0
//     },
//     {
//         title: "talesh",
//         cover: "talesh.webp",
//         persianTitle: "تالش",
//         count: 0
//     },
//     {
//         title: "tehran",
//         cover: "tehran.webp",
//         persianTitle: "تهران",
//         count: 0
//     },
// ]


// const cityCounts = allVillas.reduce((acc, villa) => {
//     const city = villa.address.city;
//     const state = villa.address.state;
//     acc[city] = (acc[city] || 0) + 1;
//     acc[state] = (acc[state] || 0) + 1;
//     return acc;
// }, {});

// const sortedCities = city.map((city) => ({
//     ...city,
//     count: cityCounts[city.title] || 0,
// })).sort((a, b) => b.count - a.count);

// const cityCounts = allVillas.reduce((acc, villa) => {
//     const city = villa.address.city;
//     const state = villa.address.state;
//     acc[city] = (acc[city] || 0) + 1;
//     acc[state] = (acc[state] || 0) + 1;
//     return acc;
// }, {});

// const sortedCities = city.map((city) => ({
//     ...city,
//     count: cityCounts[city.title] || 0,
// })).sort((a, b) => b.count - a.count);