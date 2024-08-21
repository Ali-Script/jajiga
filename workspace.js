let villas = [
    {
        aboutVilla: {
            id: 1,
            villaZone: "littoral",
        },
    },
    {
        aboutVilla: {
            id: 2,
            villaZone: "silvan",
        },
    },
    {
        aboutVilla: {
            id: 3,
            villaZone: "summerVilla",
        },
    },
    {
        aboutVilla: {
            id: 4,
            villaZone: "desertHouse",
        },
    },
    {
        aboutVilla: {
            id: 5,
            villaZone: "townHouse",
        },
    },
    {
        aboutVilla: {
            id: 7,
            villaZone: "cottage",
        },
    },
    {
        aboutVilla: {
            id: 8,
            villaZone: "townHouse",
        },
    },
    {
        aboutVilla: {
            id: 9,
            villaZone: "cottage",
        },
    },
]




let allZone = [
    {
        title: "littoral",
        cover: "littoral.webp",
        persianTitle: "ویلا ساحلی",
        count: null
    },
    {
        title: "silvan",
        cover: "silvan.webp",
        persianTitle: "ویلا ییلاقی",
        count: null
    },
    {
        title: "summerVilla",
        cover: "summerVilla.webp",
        persianTitle: "اقامتگاه تابستانه",
        count: null
    },
    {
        title: "desertHouse",
        cover: "desertHouse.webp",
        persianTitle: "اقامتگاه صحرایی",
        count: null
    },
    {
        title: "townHouse",
        cover: "townHouse.webp",
        persianTitle: "ویلا شهری",
        count: null
    },
    {
        title: "cottage",
        cover: "cottage.webp",
        persianTitle: "کلبه چوبی جنگلی",
        count: null
    },
    {
        title: "suburbanHouse",
        cover: "suburbanHouse.webp",
        persianTitle: "ویلا حومه شهر",
        count: null
    },
]


let ordredVillas = [
    {
        title: "littoral",
        cover: "littoral.webp",
        persianTitle: "ویلا ساحلی",
        count: 1
    },
    {
        title: "silvan",
        cover: "silvan.webp",
        persianTitle: "ویلا ییلاقی",
        count: 1
    },
    {
        title: "summerVilla",
        cover: "summerVilla.webp",
        persianTitle: "اقامتگاه تابستانه",
        count: 1
    },
    {
        title: "desertHouse",
        cover: "desertHouse.webp",
        persianTitle: "اقامتگاه صحرایی",
        count: 1
    },
    {
        title: "townHouse",
        cover: "townHouse.webp",
        persianTitle: "ویلا شهری",
        count: 2
    },
    {
        title: "suburbanHouse",
        cover: "suburbanHouse.webp",
        persianTitle: "ویلا حومه شهر",
        count: 0
    },
    {
        title: "cottage",
        cover: "cottage.webp",
        persianTitle: "کلبه چوبی جنگلی",
        count: 2
    },
]



const villasByZone = villas.reduce((acc, villa) => {
    const zone = villa.aboutVilla.villaZone;
    acc[zone] = (acc[zone] || 0) + 1;
    return acc;
}, {});

const orderedVillas = allZone.map((zone) => ({
    ...zone,
    count: villasByZone[zone.title] || 0,
})).sort((a, b) => b.count - a.count);


