const mongoose = require('mongoose')
const userModel = require('./../auth/model')
const villaModel = require('./../villas/model')
const categoryModel = require('./../category/model')
const reserveModel = require('./../reserve/model')
const moment = require('jalali-moment')

exports.get = async (req, res) => {
    try {

        const users = await userModel.find({}).lean()
        const categories = await categoryModel.find({}).lean()
        const villas = await villaModel.find({}).lean()
        const reserve = await reserveModel.find({}).lean()

        const lastTenElements = users.slice(-10);
        lastTenElements.forEach(element => Reflect.deleteProperty(element, "password"))


        let array = []

        villas.forEach(villa => {

            const createdAt = villa.createdAt;
            const persianDate = moment(createdAt).locale('fa').format('jYYYY/jM/jD');

            array.push({ persianDate, id: villa._id })

        })

        const now = moment();

        let arrayR = []

        reserve.forEach(book => {
            arrayR.push({ persianDate: book.date.from, id: book._id })
        })

        const fiveMonthsAgoR = now.clone().subtract(5, 'jMonth');

        const fiveMonthsAgo = now.clone().subtract(5, 'jMonth');

        const filteredV = array.filter(item => {
            const date = moment(item.persianDate, 'jYYYY/jM/jD');
            return date.isAfter(fiveMonthsAgo) && date.isBefore(now);
        });

        const lastFiveMonthAddedVillasCount = [];
        for (let i = 0; i < 5; i++) {
            const month = now.clone().subtract(i, 'jMonth').jMonth() + 1;
            const count = filteredV.reduce((acc, item) => {
                const itemMonth = moment(item.persianDate, 'jYYYY/jM/jD').jMonth() + 1;
                if (itemMonth === month) acc++;
                return acc;
            }, 0);
            lastFiveMonthAddedVillasCount.push({ month, villasCount: count });
        }

        const filteredR = arrayR


        const lastFiveMonthBookedReserve = [];
        for (let i = 0; i < 5; i++) {
            const month = now.clone().subtract(i, 'jMonth').jMonth() + 1;
            const count = filteredR.reduce((acc, item) => {
                const itemMonth = moment(item.persianDate, 'jYYYY/jM/jD').jMonth() + 1;
                if (itemMonth === month) acc++;
                return acc;
            }, 0);
            lastFiveMonthBookedReserve.push({ month, booksCount: count });
        }

        categories.forEach(category => {
            category.villas = villas.filter(villa => villa.aboutVilla.villaType.toString() === category._id.toString()).length || 0;

            if (category.href == "houseboat") category.cover = "kish.webp"
            if (category.href == "boutiqueHotel") category.cover = "rasht.webp"
            if (category.href == "inn") category.cover = "masal.webp"
            if (category.href == "hostle") category.cover = "kordan.webp"
            if (category.href == "dorm") category.cover = "shahriar.webp"
            if (category.href == "tent") category.cover = "talesh.webp"
            if (category.href == "guestHouse") category.cover = "tabriz.webp"
            if (category.href == "hotelApartment") category.cover = "sari.webp"
            if (category.href == "apartment") category.cover = "sari.webp"
            if (category.href == "ecoResort") category.cover = "savadkuh.webp"
            if (category.href == "cottage") category.cover = "kordan.webp"
            if (category.href == "farmhouse") category.cover = "kelardasht.webp"
            if (category.href == "suite") category.cover = "shahriar.webp"
            if (category.href == "house") category.cover = "kordan.webp"

        });


        return res.status(200).json({
            statusCode: 200,
            usersCount: users.length,
            villasCount: villas.length,
            categoriesCount: categories.length,
            booksCount: reserve.length,
            lastFiveMonthAddedVillasCount,
            lastFiveMonthBookedReserve,
            users: lastTenElements,
            categories
        });
    } catch (err) {
        return res.status(500).json({ statusCode: 500, message: err.message });
    }
}
