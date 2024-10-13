const mongoose = require('mongoose')
const joi = require('./../../validator/reserveValidator');
const villaModel = require('../villas/model')
const reserveModel = require('./model')
const JalaliDate = require('jalali-date');
const moment = require('jalali-moment');

exports.reserve = async (req, res) => {
    try {

        const villaID = req.params.villaID
        const user = req.user
        const { date, guestNumber } = req.body

        const validator = joi.validate({ villa: villaID, date, guestNumber })
        if (validator.error) return res.status(409).json({ statusCode: 409, message: validator.error.details })


        let from = date.from
        let to = date.to
        let splitedFrom = from.split("/")
        let splitedTo = to.split("/")

        const isReservedd = await reserveModel.find({ villa: villaID }).sort({ _id: -1 });

        if (isReservedd.length > 0) {
            const existingFrom = new JalaliDate(isReservedd[0].date.from.split('/').map(Number)).toGregorian();
            const existingTo = new JalaliDate(isReservedd[0].date.to.split('/').map(Number)).toGregorian();
            const fromGregorian = new JalaliDate(from.split('/').map(Number)).toGregorian();
            const toGregorian = new JalaliDate(to.split('/').map(Number)).toGregorian();

            if (fromGregorian >= existingFrom && fromGregorian <= existingTo ||
                toGregorian >= existingFrom && toGregorian <= existingTo ||
                fromGregorian <= existingFrom && toGregorian >= existingTo) {
                return res.status(422).json({ statusCode: 422, message: "Villa is already booked" })
            }
        }








        const isReservedUser = await reserveModel.find({
            villa: villaID,
            user: user._id,
            $or: [
                { "date.from": { $lte: date.to }, "date.to": { $gte: date.from } },
                { "date.from": { $lte: date.from }, "date.to": { $gte: date.to } },
                { "date.from": { $gte: date.from }, "date.to": { $lte: date.to } },
            ]
        }).sort({ _id: -1 })

        if (isReservedUser.length > 0) {
            const existingFrom = new JalaliDate(isReservedUser[0].date.from.split('/').map(Number)).toGregorian();
            const existingTo = new JalaliDate(isReservedUser[0].date.to.split('/').map(Number)).toGregorian();
            const fromGregorian = new JalaliDate(date.from.split('/').map(Number)).toGregorian();
            const toGregorian = new JalaliDate(date.to.split('/').map(Number)).toGregorian();

            if (fromGregorian >= existingFrom && fromGregorian <= existingTo ||
                toGregorian >= existingFrom && toGregorian <= existingTo ||
                fromGregorian <= existingFrom && toGregorian >= existingTo) {
                return res.status(422).json({ statusCode: 422, message: "Villa is already booked by this user" })
            }
        }




        const villa = await villaModel.findOne({ _id: villaID, finished: true, isAccepted: "true" })
        if (!villa) return res.status(404).json({ statusCode: 404, message: "Villa not found 404 !" })
        else if (villa.capacity.maxCapacity < guestNumber) return res.status(400).json({ statusCode: 404, message: "geustNumber is bigger than maxCapacity" })

        const isReserved = await reserveModel.find({ villa: villaID }).sort({ _id: -1 })

        if (isReserved[0]) {

            // if (isReserved[0].date.to >= date.from) return res.status(422).json({ statusCode: 422, message: "Villa is already booked" })

            const [fromYear, fromMonth, fromDay] = from.split('/').map(Number);
            const [toYear, toMonth, toDay] = isReserved[0].date.to.split('/').map(Number);

            if (new Date(fromYear, fromMonth - 1, fromDay) <= new Date(toYear, toMonth - 1, toDay)) {
                return res.status(422).json({ statusCode: 422, message: "Villa is already booked" })
            }

        }
        // let from = date.from
        // let to = date.to
        // let splitedFrom = from.split("/")
        // let splitedTo = to.split("/")





        if (splitedFrom[1] < splitedTo[1]) {

            const dateStr = from;
            const date = moment(dateStr, 'jYYYY/jM/jD');
            const endOfMonth = date.clone().endOf('jMonth');
            const daysBetweenMiddleOfMonthAndEndOfMonth = endOfMonth.diff(date, 'days') + 1;
            let thursdaysAtFrom = 0;
            let fridaysAtFrom = 0;

            for (let m = date.clone(); m.isBefore(endOfMonth) || m.isSame(endOfMonth); m.add(1, 'days')) {
                if (m.day() === 4) {
                    thursdaysAtFrom++;
                } else if (m.day() === 5) {
                    fridaysAtFrom++;
                }
            }
            let holidaysFrom = thursdaysAtFrom + fridaysAtFrom
            let midWeekFrom = daysBetweenMiddleOfMonthAndEndOfMonth - holidaysFrom





            function persianToGregorian(year, month, day) {
                const persianDate = new Date(year, month - 1, day);
                return persianDate.toLocaleDateString('en-CA', { year: 'numeric', month: '2-digit', day: '2-digit' });
            }





            function countThursdaysAndFridays(startDate, endDate) {
                let thursdays = 0;
                let fridays = 0;
                let currentDate = new Date(startDate);

                while (currentDate <= endDate) {
                    const dayOfWeek = currentDate.getDay();
                    if (dayOfWeek === 4) thursdays++;
                    if (dayOfWeek === 5) fridays++;
                    currentDate.setDate(currentDate.getDate() + 1);
                }

                return { thursdays, fridays };
            }


            const persianStartDate = new JalaliDate(splitedTo[0], splitedTo[1], 1).toGregorian();
            const persianEndDate = new JalaliDate(splitedTo).toGregorian();

            const result = countThursdaysAndFridays(new Date(persianStartDate), new Date(persianEndDate));

            let holidaysTo = result.thursdays + result.fridays
            let midweekToDiff = +splitedTo[2]
            let midWeekTo = midweekToDiff - holidaysTo



            function daysBetweenPersianDates(startDate, endDate) {
                const start = moment(startDate, 'jYYYY/jM/jD').format('YYYY-MM-DD');
                const end = moment(endDate, 'jYYYY/jM/jD').format('YYYY-MM-DD');

                const startDateObj = new Date(start);
                const endDateObj = new Date(end);

                const timeDifference = endDateObj - startDateObj;
                const daysDifference = timeDifference / (1000 * 60 * 60 * 24) + 1;

                return daysDifference;
            }


            const persianStartDateFrom = from;
            const persianEndDateTo = to;

            const resultDiff = daysBetweenPersianDates(persianStartDateFrom, persianEndDateTo);

            let midWeekPriceFrom = 0
            let holyDaysPriceFrom = 0
            let totalPrice = 0

            let monthFrom = from.split("/")[1]

            if (monthFrom == 1 | monthFrom == 2 | monthFrom == 3) {
                let holidaysPrice = villa.price.spring.holidays * holidaysFrom
                let midWeekPrice = villa.price.spring.midWeek * midWeekFrom
                midWeekPriceFrom = villa.price.spring.midWeek
                holyDaysPriceFrom = villa.price.spring.holidays
                totalPrice = midWeekPrice + holidaysPrice
            }
            // * بهار
            else if (monthFrom == 4 | monthFrom == 5 | monthFrom == 6) {
                let holidaysPrice = villa.price.summer.holidays * holidaysFrom
                let midWeekPrice = villa.price.summer.midWeek * midWeekFrom
                midWeekPriceFrom = villa.price.summer.midWeek
                holyDaysPriceFrom = villa.price.summer.holidays
                totalPrice = midWeekPrice + holidaysPrice
            }
            // * تابستان
            else if (monthFrom == 7 | monthFrom == 8 | monthFrom == 9) {
                let holidaysPrice = villa.price.autumn.holidays * holidaysFrom
                let midWeekPrice = villa.price.autumn.midWeek * midWeekFrom
                midWeekPriceFrom = villa.price.autumn.midWeek
                holyDaysPriceFrom = villa.price.autumn.holidays
                totalPrice = midWeekPrice + holidaysPrice
            }
            // * پاییز
            else if (monthFrom == 10 | monthFrom == 11 | monthFrom == 12) {
                let holidaysPrice = villa.price.winter.holidays * holidaysFrom
                let midWeekPrice = villa.price.winter.midWeek * midWeekFrom
                midWeekPriceFrom = villa.price.winter.midWeek
                holyDaysPriceFrom = villa.price.winter.holidays
                totalPrice = midWeekPrice + holidaysPrice
            }
            // * زمستان


            let midWeekPriceTo = 0
            let holyDaysPriceTo = 0

            let monthTo = to.split("/")[1]

            if (monthTo == 1 | monthTo == 2 | monthTo == 3) {
                let holidaysPrice = villa.price.spring.holidays * holidaysTo
                let midWeekPrice = villa.price.spring.midWeek * midWeekTo
                midWeekPriceTo = villa.price.spring.midWeek
                holyDaysPriceTo = villa.price.spring.holidays
                totalPrice += midWeekPrice + holidaysPrice
            }
            // * بهار
            else if (monthTo == 4 | monthTo == 5 | monthTo == 6) {
                let holidaysPrice = villa.price.summer.holidays * holidaysTo
                let midWeekPrice = villa.price.summer.midWeek * midWeekTo
                midWeekPriceTo = villa.price.summer.midWeek
                holyDaysPriceTo = villa.price.summer.holidays
                totalPrice += midWeekPrice + holidaysPrice
            }
            // * تابستان
            else if (monthTo == 7 | monthTo == 8 | monthTo == 9) {
                let holidaysPrice = villa.price.autumn.holidays * holidaysTo
                let midWeekPrice = villa.price.autumn.midWeek * midWeekTo
                midWeekPriceTo = villa.price.autumn.midWeek
                holyDaysPriceTo = villa.price.autumn.holidays
                totalPrice += midWeekPrice + holidaysPrice
            }
            // * پاییز
            else if (monthTo == 10 | monthTo == 11 | monthTo == 12) {
                let holidaysPrice = villa.price.winter.holidays * holidaysTo
                let midWeekPrice = villa.price.winter.midWeek * midWeekTo
                midWeekPriceTo = villa.price.winter.midWeek
                holyDaysPriceTo = villa.price.winter.holidays
                totalPrice += midWeekPrice + holidaysPrice
            }
            // * زمستان


            let reserve = new reserveModel({
                villa: villaID,
                user: user._id,
                date: req.body.date,
                price: totalPrice,
                guestNumber
            })
            reserve = await reserve.save();

            return res.status(200).json({ statusCode: 200, message: "Successful booking" })




        }


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


        let month = from.split("/")[1]

        if (month == 1 | month == 2 | month == 3) {
            let holidaysPrice = villa.price.spring.holidays * holyDays
            let midWeekPrice = villa.price.spring.midWeek * midWeeks
            midWeekTotalPrice = villa.price.spring.midWeek
            holyDaysTotalPrice = villa.price.spring.holidays
            totalPrice += midWeekPrice + holidaysPrice
        }
        // * بهار
        else if (month == 4 | month == 5 | month == 6) {
            let holidaysPrice = villa.price.summer.holidays * holyDays
            let midWeekPrice = villa.price.summer.midWeek * midWeeks
            midWeekTotalPrice = villa.price.summer.midWeek
            holyDaysTotalPrice = villa.price.summer.holidays
            totalPrice += midWeekPrice + holidaysPrice
        }
        // * تابستان
        else if (month == 7 | month == 8 | month == 9) {
            let holidaysPrice = villa.price.autumn.holidays * holyDays
            let midWeekPrice = villa.price.autumn.midWeek * midWeeks
            midWeekTotalPrice = villa.price.autumn.midWeek
            holyDaysTotalPrice = villa.price.autumn.holidays
            totalPrice += midWeekPrice + holidaysPrice
        }
        // * پاییز
        else if (month == 10 | month == 11 | month == 12) {
            let holidaysPrice = villa.price.winter.holidays * holyDays
            let midWeekPrice = villa.price.winter.midWeek * midWeeks
            midWeekTotalPrice = villa.price.winter.midWeek
            holyDaysTotalPrice = villa.price.winter.holidays
            totalPrice += midWeekPrice + holidaysPrice
        }
        // * زمستان

        // return res.status(200).json({
        //     statusCode: 200,
        //     midWeeks,
        //     holyDays,
        //     midWeekTotalPrice,
        //     holyDaysTotalPrice,
        //     totalDays: holyDays + midWeeks,
        //     totalPrice

        // })




















        let reserve = new reserveModel({
            villa: villaID,
            user: user._id,
            date,
            price: totalPrice,
            guestNumber
        })
        reserve = await reserve.save();

        return res.status(200).json({ statusCode: 200, message: "Successful booking" })

    } catch (err) { return res.status(500).json({ statusCode: 500, message: err.message }); }
}
exports.reservePrice = async (req, res) => {
    try {

        const villaID = req.params.villaID

        const { date } = req.body

        const validator = joi.validate({ villa: villaID, date, guestNumber: 3 })
        if (validator.error) return res.status(409).json({ statusCode: 409, message: validator.error.details })



        let from = date.from
        let to = date.to
        let splitedFrom = from.split("/")
        let splitedTo = to.split("/")

        const [fromYear, fromMonth, fromDay] = from.split('/').map(Number);
        const [toYear, toMonth, toDay] = to.split('/').map(Number);

        if (new Date(fromYear, fromMonth - 1, fromDay) >= new Date(toYear, toMonth - 1, toDay)) {
            return res.status(402).json({ statusCode: 402, message: "date>to should be greater than date>from" });
        }

        const villa = await villaModel.findOne({ _id: villaID, finished: true, isAccepted: "true" })
        if (!villa) return res.status(404).json({ statusCode: 404, message: "Villa not found 404 !" })


        if (splitedFrom[1] < splitedTo[1]) {

            const dateStr = from;
            const date = moment(dateStr, 'jYYYY/jM/jD');
            const endOfMonth = date.clone().endOf('jMonth');
            const daysBetweenMiddleOfMonthAndEndOfMonth = endOfMonth.diff(date, 'days') + 1;
            let thursdaysAtFrom = 0;
            let fridaysAtFrom = 0;

            for (let m = date.clone(); m.isBefore(endOfMonth) || m.isSame(endOfMonth); m.add(1, 'days')) {
                if (m.day() === 4) {
                    thursdaysAtFrom++;
                } else if (m.day() === 5) {
                    fridaysAtFrom++;
                }
            }
            let holidaysFrom = thursdaysAtFrom + fridaysAtFrom
            let midWeekFrom = daysBetweenMiddleOfMonthAndEndOfMonth - holidaysFrom





            function persianToGregorian(year, month, day) {
                const persianDate = new Date(year, month - 1, day);
                return persianDate.toLocaleDateString('en-CA', { year: 'numeric', month: '2-digit', day: '2-digit' });
            }





            function countThursdaysAndFridays(startDate, endDate) {
                let thursdays = 0;
                let fridays = 0;
                let currentDate = new Date(startDate);

                while (currentDate <= endDate) {
                    const dayOfWeek = currentDate.getDay();
                    if (dayOfWeek === 4) thursdays++;
                    if (dayOfWeek === 5) fridays++;
                    currentDate.setDate(currentDate.getDate() + 1);
                }

                return { thursdays, fridays };
            }


            const persianStartDate = new JalaliDate(splitedTo[0], splitedTo[1], 1).toGregorian();
            const persianEndDate = new JalaliDate(splitedTo).toGregorian();

            const result = countThursdaysAndFridays(new Date(persianStartDate), new Date(persianEndDate));

            let holidaysTo = result.thursdays + result.fridays
            let midweekToDiff = +splitedTo[2]
            let midWeekTo = midweekToDiff - holidaysTo



            function daysBetweenPersianDates(startDate, endDate) {
                const start = moment(startDate, 'jYYYY/jM/jD').format('YYYY-MM-DD');
                const end = moment(endDate, 'jYYYY/jM/jD').format('YYYY-MM-DD');

                const startDateObj = new Date(start);
                const endDateObj = new Date(end);

                const timeDifference = endDateObj - startDateObj;
                const daysDifference = timeDifference / (1000 * 60 * 60 * 24) + 1;

                return daysDifference;
            }


            const persianStartDateFrom = from;
            const persianEndDateTo = to;

            const resultDiff = daysBetweenPersianDates(persianStartDateFrom, persianEndDateTo);

            let midWeekPriceFrom = 0
            let holyDaysPriceFrom = 0
            let totalPrice = 0

            let monthFrom = from.split("/")[1]

            if (monthFrom == 1 | monthFrom == 2 | monthFrom == 3) {
                let holidaysPrice = villa.price.spring.holidays * holidaysFrom
                let midWeekPrice = villa.price.spring.midWeek * midWeekFrom
                midWeekPriceFrom = villa.price.spring.midWeek
                holyDaysPriceFrom = villa.price.spring.holidays
                totalPrice = midWeekPrice + holidaysPrice
            }
            // * بهار
            else if (monthFrom == 4 | monthFrom == 5 | monthFrom == 6) {
                let holidaysPrice = villa.price.summer.holidays * holidaysFrom
                let midWeekPrice = villa.price.summer.midWeek * midWeekFrom
                midWeekPriceFrom = villa.price.summer.midWeek
                holyDaysPriceFrom = villa.price.summer.holidays
                totalPrice = midWeekPrice + holidaysPrice
            }
            // * تابستان
            else if (monthFrom == 7 | monthFrom == 8 | monthFrom == 9) {
                let holidaysPrice = villa.price.autumn.holidays * holidaysFrom
                let midWeekPrice = villa.price.autumn.midWeek * midWeekFrom
                midWeekPriceFrom = villa.price.autumn.midWeek
                holyDaysPriceFrom = villa.price.autumn.holidays
                totalPrice = midWeekPrice + holidaysPrice
            }
            // * پاییز
            else if (monthFrom == 10 | monthFrom == 11 | monthFrom == 12) {
                let holidaysPrice = villa.price.winter.holidays * holidaysFrom
                let midWeekPrice = villa.price.winter.midWeek * midWeekFrom
                midWeekPriceFrom = villa.price.winter.midWeek
                holyDaysPriceFrom = villa.price.winter.holidays
                totalPrice = midWeekPrice + holidaysPrice
            }
            // * زمستان


            let midWeekPriceTo = 0
            let holyDaysPriceTo = 0

            let monthTo = to.split("/")[1]

            if (monthTo == 1 | monthTo == 2 | monthTo == 3) {
                let holidaysPrice = villa.price.spring.holidays * holidaysTo
                let midWeekPrice = villa.price.spring.midWeek * midWeekTo
                midWeekPriceTo = villa.price.spring.midWeek
                holyDaysPriceTo = villa.price.spring.holidays
                totalPrice += midWeekPrice + holidaysPrice
            }
            // * بهار
            else if (monthTo == 4 | monthTo == 5 | monthTo == 6) {
                let holidaysPrice = villa.price.summer.holidays * holidaysTo
                let midWeekPrice = villa.price.summer.midWeek * midWeekTo
                midWeekPriceTo = villa.price.summer.midWeek
                holyDaysPriceTo = villa.price.summer.holidays
                totalPrice += midWeekPrice + holidaysPrice
            }
            // * تابستان
            else if (monthTo == 7 | monthTo == 8 | monthTo == 9) {
                let holidaysPrice = villa.price.autumn.holidays * holidaysTo
                let midWeekPrice = villa.price.autumn.midWeek * midWeekTo
                midWeekPriceTo = villa.price.autumn.midWeek
                holyDaysPriceTo = villa.price.autumn.holidays
                totalPrice += midWeekPrice + holidaysPrice
            }
            // * پاییز
            else if (monthTo == 10 | monthTo == 11 | monthTo == 12) {
                let holidaysPrice = villa.price.winter.holidays * holidaysTo
                let midWeekPrice = villa.price.winter.midWeek * midWeekTo
                midWeekPriceTo = villa.price.winter.midWeek
                holyDaysPriceTo = villa.price.winter.holidays
                totalPrice += midWeekPrice + holidaysPrice
            }
            // * زمستان


            return res.status(200).json({
                statusCode: 200,
                firstMonthDays: daysBetweenMiddleOfMonthAndEndOfMonth,
                firstMonthMidWeekDays: midWeekFrom,
                firstMonthHoliDays: holidaysFrom,
                firstMonthMidWeekDaysPrice: midWeekPriceFrom,
                firstMonthHoliDaysPrice: holyDaysPriceFrom,
                secondMonthDays: midweekToDiff,
                secondMonthMidWeekDays: midWeekTo,
                secondMonthHoliDays: holidaysTo,
                secondMonthMidWeekDaysPrice: midWeekPriceTo,
                secondMonthHoliDaysPrice: holyDaysPriceTo,
                totalDays: resultDiff,
                totalPrice
            });




        }


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


        let month = from.split("/")[1]

        if (month == 1 | month == 2 | month == 3) {
            let holidaysPrice = villa.price.spring.holidays * holyDays
            let midWeekPrice = villa.price.spring.midWeek * midWeeks
            midWeekTotalPrice = villa.price.spring.midWeek
            holyDaysTotalPrice = villa.price.spring.holidays
            totalPrice += midWeekPrice + holidaysPrice
        }
        // * بهار
        else if (month == 4 | month == 5 | month == 6) {
            let holidaysPrice = villa.price.summer.holidays * holyDays
            let midWeekPrice = villa.price.summer.midWeek * midWeeks
            midWeekTotalPrice = villa.price.summer.midWeek
            holyDaysTotalPrice = villa.price.summer.holidays
            totalPrice += midWeekPrice + holidaysPrice
        }
        // * تابستان
        else if (month == 7 | month == 8 | month == 9) {
            let holidaysPrice = villa.price.autumn.holidays * holyDays
            let midWeekPrice = villa.price.autumn.midWeek * midWeeks
            midWeekTotalPrice = villa.price.autumn.midWeek
            holyDaysTotalPrice = villa.price.autumn.holidays
            totalPrice += midWeekPrice + holidaysPrice
        }
        // * پاییز
        else if (month == 10 | month == 11 | month == 12) {
            let holidaysPrice = villa.price.winter.holidays * holyDays
            let midWeekPrice = villa.price.winter.midWeek * midWeeks
            midWeekTotalPrice = villa.price.winter.midWeek
            holyDaysTotalPrice = villa.price.winter.holidays
            totalPrice += midWeekPrice + holidaysPrice
        }
        // * زمستان

        return res.status(200).json({
            statusCode: 200,
            midWeeks,
            holyDays,
            midWeekTotalPrice,
            holyDaysTotalPrice,
            totalDays: holyDays + midWeeks,
            totalPrice

        })

    } catch (err) { return res.status(500).json({ statusCode: 500, message: err.message }); }
}
