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
        const villass = await villaModel.find({}).lean()
        const rejectedVillas = await villaModel.find({ isAccepted: "rejected" }).lean()

        const villas = villass.filter(villa => !rejectedVillas.find(rejectedVilla => String(villa._id) === String(rejectedVilla._id)));


        const reserve = await reserveModel.find({}).populate("user", "firstName lastName phone").lean()

        const lastTenElements = reserve.slice(-10);


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


        return res.status(200).json({
            statusCode: 200,
            usersCount: users.length,
            villasCount: villas.length,
            categoriesCount: categories.length,
            booksCount: reserve.length,
            lastFiveMonthAddedVillasCount,
            lastFiveMonthBookedReserve,
            books: lastTenElements
        });
    } catch (err) {
        return res.status(500).json({ statusCode: 500, message: err.message });
    }
}
