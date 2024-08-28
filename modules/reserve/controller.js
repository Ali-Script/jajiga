const mongoose = require('mongoose')
const joi = require('./../../validator/reserveValidator');
const villaModel = require('../villas/model')
const reserveModel = require('./model')
const JalaliDate = require('jalali-date');
let realTimeDate = new Date()
exports.reserve = async (req, res) => {
    try {

        const villaID = req.params.villaID
        const user = req.user
        const { date } = req.body

        const validator = joi.validate({ villa: villaID, date })
        if (validator.error) return res.status(409).json({ statusCode: 409, message: validator.error.details })



        let from = date.from
        let to = date.to
        let splitedFrom = from.split("/").join('')
        let splitedTo = to.split("/").join('')

        if (+splitedFrom >= +splitedTo) return res.status(402).json({ statusCode: 402, message: "date>to  should greater than date>from" })


        const checkVillaExists = await villaModel.findOne({ _id: villaID })
        if (!checkVillaExists) return res.status(404).json({ statusCode: 404, message: "Villa not found 404 !" })


        const isReserved = await reserveModel.find({ villa: villaID }).sort({ _id: -1 })

        if (isReserved[0]) {

            if (isReserved[0].date.to >= date.from) return res.status(422).json({ statusCode: 422, message: "Villa is already booked" })

        }

        let reserve = new reserveModel({
            villa: villaID,
            user: user._id,
            date
        })
        reserve = await reserve.save();

        return res.status(200).json({ statusCode: 200, message: "Successful booking" })

    } catch (err) { return res.status(500).json({ statusCode: 500, message: err.message }); }
}
exports.reservePrice = async (req, res) => {
    try {

        const villaID = req.params.villaID

        const { date } = req.body

        const validator = joi.validate({ villa: villaID, date })
        if (validator.error) return res.status(409).json({ statusCode: 409, message: validator.error.details })



        let from = date.from
        let to = date.to
        let splitedFrom = from.split("/").join('')
        let splitedTo = to.split("/").join('')

        const [fromYear, fromMonth, fromDay] = from.split('/').map(Number);
        const [toYear, toMonth, toDay] = to.split('/').map(Number);

        if (new Date(fromYear, fromMonth - 1, fromDay) >= new Date(toYear, toMonth - 1, toDay)) {
            return res.status(402).json({ statusCode: 402, message: "date>to should be greater than date>from" });
        }

        const villa = await villaModel.findOne({ _id: villaID })
        if (!villa) return res.status(404).json({ statusCode: 404, message: "Villa not found 404 !" })


        function persianToGregorian(persianDate) {
            const [year, month, day] = persianDate.split('/').map(Number);
            const jd = new JalaliDate(year, month, day);
            return jd.toGregorian();
        }


        function countThursdaysAndFridays(dateRange) {
            const startDate = persianToGregorian(dateRange.from);
            const endDate = persianToGregorian(dateRange.to);

            let currentDate = new Date(startDate);
            const end = new Date(endDate);

            let thursdays = 0;
            let fridays = 0;


            while (currentDate <= end) {
                const dayOfWeek = currentDate.getDay();

                if (dayOfWeek === 4) {
                    thursdays++;
                } else if (dayOfWeek === 5) {
                    fridays++;
                }
                currentDate.setDate(currentDate.getDate() + 1);
            }

            return { thursdays, fridays };
        }


        let dateRange = { from, to };
        let result = countThursdaysAndFridays(dateRange);


        let fromJalali = new JalaliDate(date.from.split('/').map(Number));
        let toJalali = new JalaliDate(date.to.split('/').map(Number));


        let fromGregorian = fromJalali.toGregorian();
        let toGregorian = toJalali.toGregorian();


        let diffInMilliseconds = toGregorian - fromGregorian;


        let diffInDays = diffInMilliseconds / (1000 * 60 * 60 * 24) + 1;
        let holyDays = result.thursdays + result.fridays
        let midWeeks = diffInDays - holyDays

        let midWeekTotalPrice = 0
        let holyDaysTotalPrice = 0
        let totalPrice = 0

        // let month = new Intl.DateTimeFormat('en-US-u-ca-persian', { month: 'numeric' }).format(realTimeDate)
        let month = from.split("/")[1]
        console.log(month);
        if (month == 1 | month == 2 | month == 3) {
            let holidaysPrice = villa.price.spring.holidays * holyDays
            let midWeekPrice = villa.price.spring.midWeek * midWeeks
            midWeekTotalPrice = midWeekPrice
            holyDaysTotalPrice = holidaysPrice
            totalPrice = midWeekPrice + holidaysPrice
        }
        // * بهار
        else if (month == 4 | month == 5 | month == 6) {
            let holidaysPrice = villa.price.summer.holidays * holyDays
            let midWeekPrice = villa.price.summer.midWeek * midWeeks
            midWeekTotalPrice = midWeekPrice
            holyDaysTotalPrice = holidaysPrice
            totalPrice = midWeekPrice + holidaysPrice
        }
        // * تابستان
        else if (month == 7 | month == 8 | month == 9) {
            let holidaysPrice = villa.price.autumn.holidays * holyDays
            let midWeekPrice = villa.price.autumn.midWeek * midWeeks
            midWeekTotalPrice = midWeekPrice
            holyDaysTotalPrice = holidaysPrice
            totalPrice = midWeekPrice + holidaysPrice
        }
        // * پاییز
        else if (month == 10 | month == 11 | month == 12) {
            let holidaysPrice = villa.price.winter.holidays * holyDays
            let midWeekPrice = villa.price.winter.midWeek * midWeeks
            midWeekTotalPrice = midWeekPrice
            holyDaysTotalPrice = holidaysPrice
            totalPrice = midWeekPrice + holidaysPrice
        }
        // * زمستان


        return res.status(200).json({
            statusCode: 200,
            thursdays: result.thursdays,
            fridays: result.fridays,
            holyDays,
            midWeeks,
            totalDays: holyDays + midWeeks,
            midWeekTotalPrice,
            holyDaysTotalPrice,
            totalPrice

        })





        // const villaID = req.params.villaID
        // const { date } = req.body;

        // const validator = joi.validate({ villa: villaID, date });
        // if (validator.error) return res.status(409).json({ statusCode: 409, message: validator.error.details });

        // let from = date.from;
        // let to = date.to;

        // const [fromYear, fromMonth, fromDay] = from.split('/').map(Number);
        // const [toYear, toMonth, toDay] = to.split('/').map(Number);

        // if (new Date(fromYear, fromMonth - 1, fromDay) >= new Date(toYear, toMonth - 1, toDay)) {
        //     return res.status(402).json({ statusCode: 402, message: "date>to should be greater than date>from" });
        // }

        // const villa = await villaModel.findOne({ _id: villaID });
        // if (!villa) return res.status(404).json({ statusCode: 404, message: "Villa not found 404 !" });

        // function persianToGregorian(persianDate) {
        //     const [year, month, day] = persianDate.split('/').map(Number);
        //     const jd = new JalaliDate(year, month, day);
        //     return jd.toGregorian();
        // }

        // function countDaysAndWeekdays(dateRange) {
        //     const startDate = persianToGregorian(dateRange.from);
        //     const endDate = persianToGregorian(dateRange.to);

        //     let currentDate = new Date(startDate);
        //     const end = new Date(endDate);

        //     let monthDays = {};
        //     while (currentDate <= end) {
        //         const persianDate = new JalaliDate(currentDate.getFullYear(), currentDate.getMonth() + 1, currentDate.getDate());
        //         const month = `month${persianDate.getMonth()}`;
        //         const dayOfWeek = currentDate.getDay();

        //         if (!monthDays[month]) {
        //             monthDays[month] = { days: 0, midWeeks: 0, thursdays: 0, fridays: 0 };
        //         }

        //         monthDays[month].days++;
        //         if (dayOfWeek >= 1 && dayOfWeek <= 3) {
        //             monthDays[month].midWeeks++;
        //         } else if (dayOfWeek === 4) {
        //             monthDays[month].thursdays++;
        //         } else if (dayOfWeek === 5) {
        //             monthDays[month].fridays++;
        //         }

        //         currentDate.setDate(currentDate.getDate() + 1);
        //     }

        //     return monthDays;
        // }

        // let dateRange = { from, to };
        // let result = countDaysAndWeekdays(dateRange);

        // res.json({ day: result });



    } catch (err) { return res.status(500).json({ statusCode: 500, message: err.message }); }
}