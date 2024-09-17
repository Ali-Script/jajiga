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
        const fiveMonthsAgo = now.clone().subtract(5, 'jMonth');

        const filteredV = array.filter(item => {
            const date = moment(item.persianDate, 'jYYYY/jM/jD');
            return date.isAfter(fiveMonthsAgo) && date.isBefore(now);
        });

        let arrayR = []

        reserve.forEach(book => {
            arrayR.push({ persianDate: book.date.from, id: book._id })
        })

        const fiveMonthsAgoR = now.clone().subtract(5, 'jMonth');

        const filteredR = arrayR.filter(item => {
            const date = moment(item.persianDate, 'jYYYY/jM/jD');
            return date.isAfter(fiveMonthsAgoR) && date.isBefore(now);
        });


        return res.status(200).json({
            statusCode: 200,
            usersCount: users.length,
            villasCount: villas.length,
            categoriesCount: categories.length,
            booksCount: reserve.length,
            lastFiveMonthAddedVillasCount: filteredV.length,
            lastFiveMonthBookedReserve: filteredR.length,
            users: lastTenElements,
            categories
        })

    } catch (err) {
        return res.status(500).json({ statusCode: 500, message: err.message });
    }
}
