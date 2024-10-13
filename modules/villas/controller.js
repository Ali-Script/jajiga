const mongoose = require('mongoose');
const villaModel = require('./../villas/model');
const reserveModel = require('./../reserve/model');
const wishesModel = require('./../wishes/model');
const userModel = require('./../auth/model');
const banModel = require('./../ban/model');
const commentModel = require('./../comment/model');
const userVilla = require('./../user-villa/model');
const jwt = require('jsonwebtoken');
const joi = require("./../../validator/villaValidator");
const moment = require('jalali-moment');
require("dotenv").config()
const date = new Date()
const shamsiDate = new Intl.DateTimeFormat('en-US-u-ca-persian', { dateStyle: 'full', timeStyle: 'long' }).format(date)


exports.add = async (req, res) => {
    try {
        const { title, finished, address, step, cover, coordinates, aboutVilla, capacity, facility, price, rules } = req.body

        const validator = joi.validate(req.body)
        if (validator.error) return res.status(409).json(validator.error.details)

        if (coordinates) {
            const ifDUPLC = await villaModel.findOne({ coordinates })
            if (ifDUPLC) return res.status(409).json({ statusCode: 409, message: "this location is already exist" })
        }

        const coverFiles = []

        if (req.files != undefined) {
            const covers = req.files;
            covers.forEach(i => coverFiles.push(i.filename))
        }
        if (coverFiles != 0) {
            if (coverFiles.length < 3) return res.status(406).json({ statusCode: 406, message: "The minimum number of photos is 3" })
        }
        let coverarray = []
        const newVilla = await villaModel.create({
            user: req.user._id,
            title,
            cover: coverFiles,
            // cover: coverFiles = undefined ? coverarray : coverFiles,
            address,
            coordinates,
            aboutVilla,
            capacity,
            facility,
            price,
            rules,
            step,
            finished,
        })

        const create = await userVilla.create({
            user: req.user._id,
            villa: newVilla._id,
        })

        return res.status(200).json({ statusCode: 200, message: "Succ !", villa: newVilla })

        // async function addnewvilla() {
        //     if (coordinates == undefined) {
        //         const newVilla = await villaModel.create({
        //             user: req.user._id,
        //             title,
        //             cover,
        //             address,
        //             coordinates,
        //             aboutVilla,
        //             capacity,
        //             facility,
        //             price,
        //             rules,
        //             step,
        //             finished
        //         })

        //         const create = await userVilla.create({
        //             user: req.user._id,
        //             villa: newVilla._id,
        //         })

        //         return res.status(200).json({ statusCode: 200, message: "Succ !", villa: newVilla })
        //     }
        //     const ifDUPLC = await villaModel.findOne({ coordinates })
        //     if (ifDUPLC) return res.status(409).json({ statusCode: 422, message: "this location is already exist" })

        //     const covers = req.files;
        //     const coverFiles = []
        //     covers.forEach(i => coverFiles.push(i.filename))

        //     const newVilla = await villaModel.create({
        //         user: req.user._id,
        //         title,
        //         cover,
        //         address,
        //         coordinates,
        //         aboutVilla,
        //         capacity,
        //         facility,
        //         price,
        //         rules,
        //         step,
        //         finished
        //     })

        //     const create = await userVilla.create({
        //         user: req.user._id,
        //         villa: newVilla._id,
        //     })

        //     return res.status(200).json({ statusCode: 200, message: "Succ !", villa: newVilla })
        // }

        // const checkExists = await userVilla.find({ user: req.user._id }).sort({ _id: -1 }).lean()
        // if (!checkExists[0]) {
        //     return addnewvilla()
        // } else {
        //     const findvilla = await villaModel.findOne({ _id: checkExists[0].villa })
        //     if (findvilla.finished == true) {
        //         return addnewvilla()
        //     }


        //     const newVilla = await villaModel.updateOne({ _id: checkExists[0].villa }, {
        //         user: req.user._id,
        //         title,
        //         cover,
        //         address,
        //         coordinates,
        //         aboutVilla,
        //         capacity,
        //         facility,
        //         price,
        //         rules,
        //         step,
        //         finished
        //     })

        //     return res.status(200).json({ statusCode: 200, message: "Succ Updated!", villa: newVilla })
        // }

    } catch (err) { return res.status(500).json({ statusCode: 500, message: err.message }); }
}
exports.update = async (req, res) => {
    try {
        const id = req.params.villaID
        const validate = mongoose.Types.ObjectId.isValid(id);
        if (!validate) return res.status(400).json({ statusCode: 400, message: 'Invalid Object Id' })

        const findVilla = await villaModel.findOne({ _id: id }).lean()
        if (!findVilla) return res.status(401).json({ statusCode: 401, message: 'no villa found with this id' })
        else if (findVilla.isAccepted == "rejected") return res.status(405).json({ statusCode: 405, message: 'this villa is rejected' })
        console.log(findVilla.user);

        if (req.user._id != String(findVilla.user)) return res.status(402).json({ statusCode: 402, message: 'you are not the owner of this villa' })

        const { title, disable, oldPics, finished, address, step, cover, coordinates, aboutVilla, capacity, facility, price, rules } = req.body

        if (oldPics) {
            var oldPicsArray = oldPics.split(";")
        }
        const validator = joi.validate(req.body)
        if (validator.error) return res.status(409).json(validator.error.details)

        if (req.files != undefined) {

            if (req.files.length != 0) {

                let coverFiles = []

                if (oldPicsArray) {
                    oldPicsArray.forEach(i => coverFiles.push(i))
                }

                const covers = req.files;
                covers.forEach(i => coverFiles.push(i.filename))

                if (coverFiles.length > 10) return res.status(406).json({ statusCode: 406, message: "The maximum number of photos is 10" })

                const newVilla = await villaModel.updateOne({ _id: id }, {
                    user: req.user._id,
                    title,
                    cover: coverFiles,
                    address,
                    coordinates,
                    aboutVilla,
                    capacity,
                    facility,
                    price,
                    rules,
                    step,
                    finished,
                    disable
                })

                const findUpdatedVilla = await villaModel.findOne({ _id: id }).lean()
                return res.status(200).json({ statusCode: 200, message: "Succ !", villa: findUpdatedVilla })

            } else {

                if (oldPics) {
                    const newVilla = await villaModel.updateOne({ _id: id }, {
                        user: req.user._id,
                        title,
                        address,
                        coordinates,
                        cover: oldPicsArray,
                        aboutVilla,
                        capacity,
                        facility,
                        price,
                        rules,
                        step,
                        finished,
                        disable
                    })

                    const findUpdatedVilla = await villaModel.findOne({ _id: id }).lean()
                    return res.status(200).json({ statusCode: 200, message: "Succ !", villa: findUpdatedVilla })
                } else {
                    const newVilla = await villaModel.updateOne({ _id: id }, {
                        user: req.user._id,
                        title,
                        address,
                        coordinates,
                        aboutVilla,
                        capacity,
                        facility,
                        price,
                        rules,
                        step,
                        finished,
                        disable
                    })

                    const findUpdatedVilla = await villaModel.findOne({ _id: id }).lean()
                    return res.status(200).json({ statusCode: 200, message: "Succ !", villa: findUpdatedVilla })
                }
            }
        }


        if (oldPics) {
            const newVilla = await villaModel.updateOne({ _id: id }, {
                user: req.user._id,
                title,
                address,
                coordinates,
                cover: oldPicsArray,
                aboutVilla,
                capacity,
                facility,
                price,
                rules,
                step,
                finished,
                disable
            })

            const findUpdatedVilla = await villaModel.findOne({ _id: id }).lean()
            return res.status(200).json({ statusCode: 200, message: "Succ !", villa: findUpdatedVilla })
        } else {
            const newVilla = await villaModel.updateOne({ _id: id }, {
                user: req.user._id,
                title,
                address,
                coordinates,
                aboutVilla,
                capacity,
                facility,
                price,
                rules,
                step,
                finished,
                disable
            })

            const findUpdatedVilla = await villaModel.findOne({ _id: id }).populate("user", "firstName lastName role avatar")
                .populate("aboutVilla.villaType").lean()
            return res.status(200).json({ statusCode: 200, message: "Succ !", villa: findUpdatedVilla })
        }

    } catch (err) { return res.status(500).json({ statusCode: 500, message: err.message }); }
}
exports.getAll = async (req, res) => {
    try {
        const villass = await villaModel.find({})
            .populate("user", "firstName lastName role avatar")
            .populate("aboutVilla.villaType")
            .sort({ _id: -1 })
            .lean()
        if (villass.length == 0) return res.status(404).json({ statusCode: 404, message: "there is no villa!" })


        const rejectedVillas = await villaModel.find({ isAccepted: "rejected" }).lean()

        const villas = villass.filter(villa => !rejectedVillas.find(rejectedVilla => String(villa._id) === String(rejectedVilla._id)));



        let ordered = []

        for (const villa of villas) {

            const getReserved = await reserveModel.find({ villa: villa._id }).sort({ _id: -1 })

            let bookDate = []

            getReserved.forEach(data => {
                let obj = { date: data.date, price: data.price }
                bookDate.push(obj)
            })


            const comments = await commentModel.find({ villa: villa._id, isAccept: "true" })
                .populate("villa", "_id ")
                .populate("creator", "firstName lastName avatar")
                .sort({ _id: -1 })
                .lean();

            let orderedComment = []

            comments.forEach(mainComment => {
                comments.forEach(answerComment => {

                    if (String(mainComment._id) == String(answerComment.mainCommentID)) {

                        orderedComment.push({
                            ...mainComment,
                            villa: answerComment.villa._id,
                            creator: answerComment.creator,
                            answerComment
                        })
                    }
                })
            })



            const noAnswerComments = await commentModel.find({ villa: villa._id, isAnswer: 0, haveAnswer: 0, isAccept: "true" })
                .populate("villa", "_id")
                .populate("creator", "firstName lastName avatar")
                .sort({ _id: -1 })
                .lean();

            noAnswerComments.forEach(i => orderedComment.push({ ...i }))
            villa.booked = bookDate.length
            villa.comments = orderedComment.length

            ordered.push(villa);
        }


        return res.status(200).json({ statusCode: 200, villas: ordered })
    } catch (err) { return res.status(500).json({ statusCode: 500, message: err.message }); }
}
exports.getAllActivated = async (req, res) => {
    try {
        const villas = await villaModel.find({ isAccepted: "true", finished: true })
            .populate("user", "firstName lastName role avatar")
            .populate("aboutVilla.villaType")
            .sort({ _id: -1 })
            .lean()
        if (villas.length == 0) return res.status(404).json({ statusCode: 404, message: "there is no villa!" })

        let ordered = []

        for (const villa of villas) {

            const getReserved = await reserveModel.find({ villa: villa._id }).sort({ _id: -1 })

            let bookDate = []

            getReserved.forEach(data => {
                let obj = { date: data.date, price: data.price }
                bookDate.push(obj)
            })


            const comments = await commentModel.find({ villa: villa._id, isAccept: "true" })
                .populate("villa", "_id ")
                .populate("creator", "firstName lastName avatar")
                .sort({ _id: -1 })
                .lean();

            let orderedComment = []

            comments.forEach(mainComment => {
                comments.forEach(answerComment => {

                    if (String(mainComment._id) == String(answerComment.mainCommentID)) {

                        orderedComment.push({
                            ...mainComment,
                            villa: answerComment.villa._id,
                            creator: answerComment.creator,
                            answerComment
                        })
                    }
                })
            })



            const noAnswerComments = await commentModel.find({ villa: villa._id, isAnswer: 0, haveAnswer: 0, isAccept: "true" })
                .populate("villa", "_id")
                .populate("creator", "firstName lastName avatar")
                .sort({ _id: -1 })
                .lean();

            noAnswerComments.forEach(i => orderedComment.push({ ...i }))
            villa.booked = bookDate.length
            villa.comments = orderedComment.length

            ordered.push(villa);
        }


        return res.status(200).json({ statusCode: 200, villas: ordered })
    } catch (err) { return res.status(500).json({ statusCode: 500, message: err.message }); }
}
exports.getOne = async (req, res) => {
    try {
        let userobj = null
        const headers = req.header("Authorization")?.split(" ")
        if (headers?.length == 2) {
            const token = headers[1]

            const decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET)
            const user = await userModel.findOne({ phone: decoded.Identifeir })
            const checkBan = await banModel.findOne({ phone: user.phone })
            if (checkBan) return res.status(403).json({ statusCode: 403, message: "Sorry u has banned from this website" })
            if (user) userobj = user.toObject()
        }

        const id = req.params.villaID
        const validate = mongoose.Types.ObjectId.isValid(id);
        if (!validate) return res.status(400).json({ statusCode: 400, message: 'Invalid Object Id' })

        const villa = await villaModel.findOne({ _id: id })
            .populate("user", "firstName lastName role avatar")
            .populate("aboutVilla.villaType")
            .lean()
        if (!villa) return res.status(404).json({ statusCode: 404, message: "villa not found 404 ! " })

        const getReserved = await reserveModel.find({ villa: villa._id }).sort({ _id: -1 })



        const today = moment().locale('fa').format('YYYY/MM/DD');

        const filterDates = (getReserved, today) => {
            const todayDate = new Date(today.replace(/(\d+)\/(\d+)\/(\d+)/, (match, p1, p2, p3) => `${p1}-${p2}-${p3}`));
            return getReserved.filter(item => {
                const toDate = new Date(item.date.to.replace(/(\d+)\/(\d+)\/(\d+)/, (match, p1, p2, p3) => `${p1}-${p2}-${p3}`));
                return toDate >= todayDate;
            });
        };

        const filteredDates = filterDates(getReserved, today);




        let bookDate = []

        filteredDates.forEach(data => {
            let obj = { date: data.date, price: data.price, guestNumber: data.guestNumber }
            function daysBetweenPersianDates(date1, date2) {
                // Parse the Persian dates
                const m1 = moment(date1, 'jYYYY/jM/jD');
                const m2 = moment(date2, 'jYYYY/jM/jD');

                // Convert to Gregorian dates
                const gDate1 = m1.format('YYYY-MM-DD');
                const gDate2 = m2.format('YYYY-MM-DD');

                // Calculate the difference in days
                const diffInDays = moment(gDate2).diff(moment(gDate1), 'days') + 1;

                return diffInDays;
            }


            const date1 = data.date.from;
            const date2 = data.date.to;
            let days = daysBetweenPersianDates(date1, date2)
            obj.days = days;
            bookDate.push(obj)
        })

        // const comments = await commentModel.find({ villa: id, isAccept: 1 })
        // const comments = await commentModel.find({ villa: id, isAccept: "true" })
        //     .populate("villa", "_id")
        //     .populate("creator", "firstName lastName avatar")
        //     .sort({ _id: -1 })
        //     .lean();

        // let orderedComment = []

        // comments.forEach(mainComment => {
        //     comments.forEach(answerComment => {

        //         if (String(mainComment._id) == String(answerComment.mainCommentID)) {

        //             orderedComment.push({
        //                 ...mainComment,
        //                 villa: answerComment.villa._id,
        //                 creator: answerComment.creator,
        //                 answerComment
        //             })
        //         }
        //     })
        // })



        // const noAnswerComments = await commentModel.find({ villa: id, isAnswer: 0, haveAnswer: 0, isAccept: "true" })
        //     .populate("villa", "_id")
        //     .populate("creator", "firstName lastName avatar")
        //     .sort({ _id: -1 })
        //     .lean();

        // noAnswerComments.forEach(i => orderedComment.push({ ...i }))



        const commentss = await commentModel.find({ villa: id, isAccept: "true" })
            .populate("villa", "_id")
            .populate("creator", "firstName lastName avatar")
            .sort({ _id: -1 })
            .lean();


        const rejectedComments = await commentModel.find({ isAccept: "rejected" }).lean()
        const comments = commentss.filter(villa => !rejectedComments.find(rejectedVilla => String(villa._id) === String(rejectedVilla._id)));

        const addedMainCommentIds = new Set();
        const answerComments = {};
        let orderedComment = []
        comments.forEach(comment => {
            if (comment.mainCommentID) {
                let mainCommentId = comment.mainCommentID;
                if (!answerComments[mainCommentId]) {
                    answerComments[mainCommentId] = [];
                }
                answerComments[mainCommentId].push(comment);
            }
        });

        comments.forEach(comment => {
            if (!comment.mainCommentID) {
                let mainCommentId = comment._id;
                if (answerComments[mainCommentId]) {
                    orderedComment.push({
                        ...comment,
                        villa: comment.villa._id,
                        creator: comment.creator ? comment.creator : null,
                        answerComment: answerComments[mainCommentId]
                    });
                    addedMainCommentIds.add(mainCommentId);
                }
            }
        });

        comments.forEach(comment => {
            if (!comment.mainCommentID && !addedMainCommentIds.has(comment._id)) {
                orderedComment.push({ ...comment, villa: comment.villa._id });
            }
        });



        if (userobj) {

            const isWishes = await wishesModel.findOne({ user: userobj._id, villa: villa._id })
            if (isWishes) villa.isWishes = true;
            else villa.isWishes = false;

            if (String(villa.user._id) == String(userobj._id)) villa.isOwner = true
            else villa.isOwner = false

        } else { villa.isWishes = false; villa.isOwner = false }


        const getR = await reserveModel.find({ villa: villa._id })


        return res.status(200).json({ statusCode: 200, villa, bookDate, successfulBooking: getR.length, comments: orderedComment })

    } catch (err) { return res.status(500).json({ statusCode: 500, message: err.message }); }
}
exports.myVillas = async (req, res) => {
    try {
        const user = req.user
        const villa = await villaModel.find({ user: user._id }).populate("aboutVilla.villaType").populate("user", "firstName lastName role avatar").lean()
        if (villa.length == 0) return res.status(404).json({ statusCode: 404, message: "You have`t add villa yet` " })
        // let newVillas = []

        // villa.forEach(async item => {

        //     const getReserved = await reserveModel.find({ villa: item._id }).sort({ _id: -1 })
        //     if (getReserved[0]) {
        //         var index = villa.findIndex(data => {
        //             return data._id == item._id
        //         })
        //         villa[index].bookedDate = 1
        //     }

        // })
        // console.log(newVillas);
        //!fghsssssssssssss
        const getReserved = await reserveModel.find({ villa: villa._id }).sort({ _id: -1 })

        let bookDate = []

        getReserved.forEach(data => {
            let obj = data.date
            bookDate.push(obj)
        })

        return res.status(200).json({ statusCode: 200, villa, bookDate })

    } catch (err) { return res.status(500).json({ statusCode: 500, message: err.message }); }
}
exports.getFacility = async (req, res) => {
    try {
        const facility = [
            {
                title: "مبلمان",
                engTitle: "furniture",
                placeHolder: "مثال: مبلمان راحتی برای 7 نفر",
                id: 1
            },
            {
                title: "یخچال",
                engTitle: "fridge",
                placeHolder: "توضیحات یخچال",
                id: 2
            },
            {
                title: "تلویزیون",
                engTitle: "tv",
                placeHolder: "مثال: یک عدد تلویزیون فلت سامسونگ 48 اینچ و یک عدد تلویزیون پارس 14 اینچ",
                id: 3
            },
            {
                title: " میز نهارخوری",
                engTitle: "diningTable",
                placeHolder: "مثال: میز نهارخوری برای 6 نفر و 6 عدد صندلی",
                id: 4
            },
            {
                title: " سیستم گرمایشی",
                engTitle: "heatingSystem",
                placeHolder: "مثال: سیستم پکیج / بخاری گازی",
                id: 5
            },
            {
                title: " سیستم سرمایش",
                engTitle: "coolingSystem",
                placeHolder: "مثال: اسپیلت 18 هزار",
                id: 6
            },
            {
                title: "پارکینگ",
                engTitle: "parking",
                placeHolder: "مثال: پارکینگ مسقف برای 2 عدد اتومبیل / پارکینگ روباز برای 3 عدد اتومبیل",
                id: 7
            },
            {
                title: "بیلیارد",
                engTitle: "eightball",
                placeHolder: "توضیحات میز بیلیارد",
                id: 8
            },
            {
                title: " wifi اینترنت",
                engTitle: "wifi",
                placeHolder: "مشخص نمایید: اینترنت کابلی / بی‌سیم-وای‌فای",
                id: 9
            },
            {
                title: " توالت فرهنگی",
                engTitle: "toilet",
                placeHolder: "توضیحات توالت فرنگی",
                id: 10
            },
            {
                title: "استخر",
                engTitle: "pool",
                placeHolder: "توضیحات استخر",
                id: 11
            }
        ]
        const sanitaryFacilities = [
            {
                title: " تعویض رو بالشتی و رو تختی",
                engTitle: "changeThePillow",
                id: 1
            },
            {
                title: " تعویض ملحفه",
                engTitle: "changeTheBedsheet",
                id: 2
            },
            {
                title: " شارژ کاغد توالت",
                engTitle: "chargingToiletPaper",
                id: 3
            },
            {
                title: " مایع ظرفشویی",
                engTitle: "dishSoap",
                id: 4
            },
            {
                title: " شارژ مایع دستشویی با صابون",
                engTitle: "chargingDishSoap",
                id: 5
            },
            {
                title: " مواد ضدعفونی کننده",
                engTitle: "antiseptics",
                id: 6
            }
        ]

        return res.status(200).json({ statusCode: 200, facility, sanitaryFacilities })

    } catch (err) { return res.status(500).json({ statusCode: 500, message: err.message }); }
}
exports.delete = async (req, res) => {
    try {
        const id = req.params.villaID
        const validate = mongoose.Types.ObjectId.isValid(id);
        if (!validate) return res.status(400).json({ statusCode: 400, error: 'Invalid Object Id' })

        const villa = await villaModel.findOneAndDelete({ _id: id })
        if (!villa) return res.status(404).json({ statusCode: 404, message: "Villa Not Found 404 ! " })

        // const deleteComment = await commentModel.deleteMany({ villa: id })
        const removeuservilla = await userVilla.findOneAndDelete({ villa: id })


        return res.status(200).json({ statusCode: 200, message: "Succ !" })
    } catch (err) { return res.status(500).json({ statusCode: 500, message: err.message }); }
}
exports.filtring = async (req, res) => {
    try {

        const allVillas = await villaModel.find({ finished: true, isAccepted: "true" }).populate("aboutVilla.villaType").sort({ _id: -1 }).lean()
        let villas = []

        if (req.query.city) {
            let result = allVillas.filter(i => {
                return i.address.city == req.query.city || i.address.state == req.query.city
            });
            if (req.query.city == "all" & result.length == 0) result = allVillas
            if (result.length == 0) return res.status(404).json({ statusCode: 404, villas: [] })
            villas.push(result)
            villas = villas[0]
        }
        if (villas.length == 0) villas = allVillas
        if (req.query.gstnum) {
            let result = villas.filter(i => {
                console.log(+i.capacity.maxCapacity > req.query.gstnum);
                return i.capacity.maxCapacity >= req.query.gstnum
            });
            if (result.length == 0) return res.status(404).json({ statusCode: 404, villas: [] })
            villas = result
        }
        if (req.query.minp & req.query.maxp) {

            let Allprice = []
            let AvrgVilla = []
            villas.forEach(villa => {

                let month = new Intl.DateTimeFormat('en-US-u-ca-persian', { month: 'numeric' }).format(date)

                if (month == 1 | month == 2 | month == 3) {

                    if (shamsiDate.includes("Friday") | shamsiDate.includes("Thursday")) {
                        var x = { id: villa._id, price: villa.price.spring.holidays }
                    } else {
                        var x = { id: villa._id, price: villa.price.spring.midWeek }
                    }
                }
                // * بهار
                else if (month == 4 | month == 5 | month == 6) {

                    if (shamsiDate.includes("Friday") | shamsiDate.includes("Thursday")) {
                        var x = { id: villa._id, price: villa.price.summer.holidays }
                    } else {
                        var x = { id: villa._id, price: villa.price.summer.midWeek }
                    }
                }
                // * تابستان
                else if (month == 7 | month == 8 | month == 9) {

                    if (shamsiDate.includes("Friday") | shamsiDate.includes("Thursday")) {
                        var x = { id: villa._id, price: villa.price.autumn.holidays }
                    } else {
                        var x = { id: villa._id, price: villa.price.autumn.midWeek }
                    }
                }
                // * پاییز
                else if (month == 10 | month == 11 | month == 12) {

                    if (shamsiDate.includes("Friday") | shamsiDate.includes("Thursday")) {
                        var x = { id: villa._id, price: villa.price.winter.holidays }
                    } else {
                        var x = { id: villa._id, price: villa.price.winter.midWeek }
                    }
                }
                // * زمستان

                if (x.price >= req.query.minp & x.price <= req.query.maxp) Allprice.push(x)
            })
            Allprice = Allprice.sort((a, b) => b.price - a.price);

            const promises = Allprice.map(async item => {
                return await villaModel.findOne({ _id: item.id })
            })
            AvrgVilla = await Promise.all(promises)

            villas = AvrgVilla

        } else if (req.query.minp) {

            let Allprice = []
            let AvrgVilla = []
            villas.forEach(villa => {
                let month = new Intl.DateTimeFormat('en-US-u-ca-persian', { month: 'numeric' }).format(date)

                if (month == 1 | month == 2 | month == 3) {

                    if (shamsiDate.includes("Friday") | shamsiDate.includes("Thursday")) {
                        var x = { id: villa._id, price: villa.price.spring.holidays }
                    } else {
                        var x = { id: villa._id, price: villa.price.spring.midWeek }
                    }
                }
                // * بهار
                else if (month == 4 | month == 5 | month == 6) {

                    if (shamsiDate.includes("Friday") | shamsiDate.includes("Thursday")) {
                        var x = { id: villa._id, price: villa.price.summer.holidays }
                    } else {
                        var x = { id: villa._id, price: villa.price.summer.midWeek }
                    }
                }
                // * تابستان
                else if (month == 7 | month == 8 | month == 9) {

                    if (shamsiDate.includes("Friday") | shamsiDate.includes("Thursday")) {
                        var x = { id: villa._id, price: villa.price.autumn.holidays }
                    } else {
                        var x = { id: villa._id, price: villa.price.autumn.midWeek }
                    }
                }
                // * پاییز
                else if (month == 10 | month == 11 | month == 12) {

                    if (shamsiDate.includes("Friday") | shamsiDate.includes("Thursday")) {
                        var x = { id: villa._id, price: villa.price.winter.holidays }
                    } else {
                        var x = { id: villa._id, price: villa.price.winter.midWeek }
                    }
                }
                // * زمستان

                if (x.price >= req.query.minp) Allprice.push(x)
            })
            Allprice = Allprice.sort((a, b) => b.price - a.price);

            const promises = Allprice.map(async item => {
                return await villaModel.findOne({ _id: item.id })
            })
            AvrgVilla = await Promise.all(promises)

            villas = AvrgVilla

        } else if (req.query.maxp) {
            let Allprice = []
            let AvrgVilla = []

            villas.forEach(villa => {
                let month = new Intl.DateTimeFormat('en-US-u-ca-persian', { month: 'numeric' }).format(date)

                if (month == 1 | month == 2 | month == 3) {

                    if (shamsiDate.includes("Friday") | shamsiDate.includes("Thursday")) {
                        var x = { id: villa._id, price: villa.price.spring.holidays }
                    } else {
                        var x = { id: villa._id, price: villa.price.spring.midWeek }
                    }
                }
                // * بهار
                else if (month == 4 | month == 5 | month == 6) {

                    if (shamsiDate.includes("Friday") | shamsiDate.includes("Thursday")) {
                        var x = { id: villa._id, price: villa.price.summer.holidays }
                    } else {
                        var x = { id: villa._id, price: villa.price.summer.midWeek }
                    }
                }
                // * تابستان
                else if (month == 7 | month == 8 | month == 9) {

                    if (shamsiDate.includes("Friday") | shamsiDate.includes("Thursday")) {
                        var x = { id: villa._id, price: villa.price.autumn.holidays }
                    } else {
                        var x = { id: villa._id, price: villa.price.autumn.midWeek }
                    }
                }
                // * پاییز
                else if (month == 10 | month == 11 | month == 12) {

                    if (shamsiDate.includes("Friday") | shamsiDate.includes("Thursday")) {
                        var x = { id: villa._id, price: villa.price.winter.holidays }
                    } else {
                        var x = { id: villa._id, price: villa.price.winter.midWeek }
                    }
                }
                // * زمستان

                if (x.price >= req.query.maxp) Allprice.push(x)
            })

            const promises = Allprice.map(async item => {
                return await villaModel.findOne({ _id: item.id })
            })
            AvrgVilla = await Promise.all(promises)

            villas = AvrgVilla
        }
        if (req.query.order) {
            if (req.query.order == "newest") { }
            else if (req.query.order == "oldest") { villas.reverse(); }
            else if (req.query.order == "high_price") {

                let Allprice = []
                let AvrgVilla = []
                villas.forEach(villa => {
                    let month = new Intl.DateTimeFormat('en-US-u-ca-persian', { month: 'numeric' }).format(date)

                    if (month == 1 | month == 2 | month == 3) {

                        if (shamsiDate.includes("Friday") | shamsiDate.includes("Thursday")) {
                            var x = { id: villa._id, price: villa.price.spring.holidays }
                        } else {
                            var x = { id: villa._id, price: villa.price.spring.midWeek }
                        }
                    }
                    // * بهار
                    else if (month == 4 | month == 5 | month == 6) {

                        if (shamsiDate.includes("Friday") | shamsiDate.includes("Thursday")) {
                            var x = { id: villa._id, price: villa.price.summer.holidays }
                        } else {
                            var x = { id: villa._id, price: villa.price.summer.midWeek }
                        }
                    }
                    // * تابستان
                    else if (month == 7 | month == 8 | month == 9) {

                        if (shamsiDate.includes("Friday") | shamsiDate.includes("Thursday")) {
                            var x = { id: villa._id, price: villa.price.autumn.holidays }
                        } else {
                            var x = { id: villa._id, price: villa.price.autumn.midWeek }
                        }
                    }
                    // * پاییز
                    else if (month == 10 | month == 11 | month == 12) {

                        if (shamsiDate.includes("Friday") | shamsiDate.includes("Thursday")) {
                            var x = { id: villa._id, price: villa.price.winter.holidays }
                        } else {
                            var x = { id: villa._id, price: villa.price.winter.midWeek }
                        }
                    }
                    // * زمستان

                    Allprice.push(x)
                })
                Allprice = Allprice.sort((a, b) => b.price - a.price);
                console.log(Allprice);
                const promises = Allprice.map(async item => {
                    return await villaModel.findOne({ _id: item.id })
                })
                AvrgVilla = await Promise.all(promises)

                villas = AvrgVilla
            }
            else if (req.query.order == "low_price") {


                let Allprice = []
                let AvrgVilla = []
                villas.forEach(villa => {
                    let month = new Intl.DateTimeFormat('en-US-u-ca-persian', { month: 'numeric' }).format(date)

                    if (month == 1 | month == 2 | month == 3) {

                        if (shamsiDate.includes("Friday") | shamsiDate.includes("Thursday")) {
                            var x = { id: villa._id, price: villa.price.spring.holidays }
                        } else {
                            var x = { id: villa._id, price: villa.price.spring.midWeek }
                        }
                    }
                    // * بهار
                    else if (month == 4 | month == 5 | month == 6) {

                        if (shamsiDate.includes("Friday") | shamsiDate.includes("Thursday")) {
                            var x = { id: villa._id, price: villa.price.summer.holidays }
                        } else {
                            var x = { id: villa._id, price: villa.price.summer.midWeek }
                        }
                    }
                    // * تابستان
                    else if (month == 7 | month == 8 | month == 9) {

                        if (shamsiDate.includes("Friday") | shamsiDate.includes("Thursday")) {
                            var x = { id: villa._id, price: villa.price.autumn.holidays }
                        } else {
                            var x = { id: villa._id, price: villa.price.autumn.midWeek }
                        }
                    }
                    // * پاییز
                    else if (month == 10 | month == 11 | month == 12) {

                        if (shamsiDate.includes("Friday") | shamsiDate.includes("Thursday")) {
                            var x = { id: villa._id, price: villa.price.winter.holidays }
                        } else {
                            var x = { id: villa._id, price: villa.price.winter.midWeek }
                        }
                    }
                    // * زمستان

                    Allprice.push(x)
                })
                Allprice = Allprice.sort((a, b) => b.price - a.price);
                console.log(Allprice);
                const promises = Allprice.map(async item => {
                    return await villaModel.findOne({ _id: item.id })
                })
                AvrgVilla = await Promise.all(promises)

                AvrgVilla.reverse();
                villas = AvrgVilla
            }
        }

        if (req.query.zone) {
            let zone = req.query.zone.split("-")
            let newVillas = []
            villas.forEach(villa => {
                zone.forEach(word => {
                    if (villa.aboutVilla.villaZone == word) newVillas.push(villa)
                })
            })
            if (newVillas.length != 0) villas = newVillas
            else if (newVillas.length == 0) return res.status(404).json({ statusCode: 404, villas: [] })

        }
        if (req.query.type) {
            let cat = req.query.type.split("-")
            let villaByCat = []
            let newVillas = []

            const promises = villas.map(async item => {
                return await villaModel.findOne({ _id: item._id }).populate("aboutVilla.villaType")
            })
            villaByCat = await Promise.all(promises)

            if (villaByCat.length != 0) {
                let flag = true
                villaByCat.forEach(villa => {

                    cat.forEach(word => {
                        if (villa.aboutVilla.villaType.href == word) newVillas.push(villa)
                    })
                })
                if (newVillas.length != 0) villas = newVillas
                else if (newVillas.length == 0) return res.status(404).json({ statusCode: 404, villas: [] })
            }
        }
        if (req.query.feature) {
            let feature = req.query.feature.split("-")
            let newVillas = []

            villas.forEach(villa => {

                let fac = {
                    heatingSystem: villa.facility.facility.heatingSystem,
                    coolingSystem: villa.facility.facility.coolingSystem,
                    parking: villa.facility.facility.parking,
                    eightball: villa.facility.facility.eightball,
                    wifi: villa.facility.facility.wifi,
                    pool: villa.facility.facility.pool
                }

                const trueKeys = Object.keys(fac).filter(key => fac[key].status === true);

                let flag;
                feature.forEach(data => {
                    if (trueKeys.includes(data)) flag = true
                    else flag = false
                })
                if (flag) newVillas.push(villa)
            })
            villas = newVillas
        }

        // villas.forEach(async villa => {
        for (const villa of villas) {

            const trueKeys = Object.keys(villa.facility.facility).filter(key => {
                if (key !== "moreFacility") return villa.facility.facility[key].status === true
            });
            if (trueKeys.length >= 5) villa.costly = true


            const getR = await reserveModel.find({ villa: villa._id })
            const getC = await commentModel.find({ villa: villa._id })
            villa.comments = getC.length
            villa.successfulBooking = getR.length
        }

        return res.status(200).json({ statusCode: 200, villas })
    } catch (err) { return res.status(500).json({ statusCode: 500, message: err.message }); }
}
exports.privilegedVillas = async (req, res) => {
    try {
        let costlyVillas = []
        const villas = await villaModel.find({ finished: true, isAccepted: "true" }).populate("aboutVilla.villaType").populate("user", "firstName lastName role avatar").lean();

        villas.forEach(villa => {
            const trueKeys = Object.keys(villa.facility.facility).filter(key => {
                if (key !== "moreFacility") return villa.facility.facility[key].status === true
            });
            if (trueKeys.length >= 5) costlyVillas.push(villa)
        })


        let ordered = []

        for (const villa of costlyVillas) {

            const getReserved = await reserveModel.find({ villa: villa._id }).sort({ _id: -1 })

            let bookDate = []

            getReserved.forEach(data => {
                let obj = { date: data.date, price: data.price }
                bookDate.push(obj)
            })

            // const comments = await commentModel.find({ villa: id, isAccept: 1 })
            const comments = await commentModel.find({ villa: villa._id, isAccept: "true" })
                .populate("villa", "_id")
                .populate("creator", "firstName lastName avatar")
                .sort({ _id: -1 })
                .lean();

            let orderedComment = []

            comments.forEach(mainComment => {
                comments.forEach(answerComment => {

                    if (String(mainComment._id) == String(answerComment.mainCommentID)) {

                        orderedComment.push({
                            ...mainComment,
                            villa: answerComment.villa._id,
                            creator: answerComment.creator,
                            answerComment
                        })
                    }
                })
            })



            const noAnswerComments = await commentModel.find({ villa: villa._id, isAnswer: 0, haveAnswer: 0, isAccept: "true" })
                .populate("villa", "_id")
                .populate("creator", "firstName lastName avatar")
                .sort({ _id: -1 })
                .lean();

            noAnswerComments.forEach(i => orderedComment.push({ ...i }))
            villa.booked = bookDate.length
            villa.comments = orderedComment.length

            ordered.push(villa);
        }




        return res.status(200).json({ statusCode: 200, villas: ordered })

    } catch (err) { return res.status(500).json({ statusCode: 500, message: err.message }); }
}
exports.popularTowns = async (req, res) => {
    try {
        const villas = await villaModel.find({ finished: true, isAccepted: "true" }).populate("aboutVilla.villaType").populate("user", "firstName lastName role avatar").lean();

        let city = [
            {
                title: "babolsar",
                cover: "babolsar.webp",
                persianTitle: "بابلسر",
                count: null
            },
            {
                title: "bandaranzali",
                cover: "bandaranzali.webp",
                persianTitle: "بندر انزلی",
                count: null
            },
            {
                title: "chalus",
                cover: "chalus.webp",
                persianTitle: "چالوس",
                count: null
            },
            {
                title: "filband",
                cover: "filband.webp",
                persianTitle: "فیلبند",
                count: null
            },
            {
                title: "fuman",
                cover: "fuman.webp",
                persianTitle: "فومن",
                count: null
            },
            {
                title: "gorgan",
                cover: "gorgan.webp",
                persianTitle: "گرگان",
                count: null
            },
            {
                title: "isfahan",
                cover: "isfahan.webp",
                persianTitle: "اصفهان",
                count: null
            },
            {
                title: "kelardasht",
                cover: "kelardasht.webp",
                persianTitle: "کلاردشت",
                count: null
            },
            {
                title: "kish",
                cover: "kish.webp",
                persianTitle: "کیش",
                count: null
            },
            {
                title: "kordan",
                cover: "kordan.webp",
                persianTitle: "کردان",
                count: null
            },
            {
                title: "lahijan",
                cover: "lahijan.webp",
                persianTitle: "لاهیجان",
                count: null
            },
            {
                title: "mahmudabad",
                cover: "mahmudabad.webp",
                persianTitle: "محمود آباد",
                count: null
            },
            {
                title: "masal",
                cover: "masal.webp",
                persianTitle: "ماسال",
                count: null
            },
            {
                title: "mashhad",
                cover: "mashhad.webp",
                persianTitle: "مشهد",
                count: null
            },
            {
                title: "motelqoo",
                cover: "motelqoo.webp",
                persianTitle: "متل قو",
                count: null
            },
            {
                title: "nowshahr",
                cover: "nowshahr.webp",
                persianTitle: "نوشهر",
                count: null
            },
            {
                title: "ramsar",
                cover: "ramsar.webp",
                persianTitle: "رامسر",
                count: null
            },
            {
                title: "rasht",
                cover: "rasht.webp",
                persianTitle: "رشت",
                count: null
            },
            {
                title: "sareyn",
                cover: "sareyn.webp",
                persianTitle: "سرعین",
                count: null
            },
            {
                title: "sari",
                cover: "sari.webp",
                persianTitle: "ساری",
                count: null
            },
            {
                title: "savadkuh",
                cover: "savadkuh.webp",
                persianTitle: "سواد کوه",
                count: null
            },
            {
                title: "shahriar",
                cover: "shahriar.webp",
                persianTitle: "شهریار",
                count: null
            },
            {
                title: "shiraz",
                cover: "shiraz.webp",
                persianTitle: "شیراز",
                count: null
            },
            {
                title: "tabriz",
                cover: "tabriz.webp",
                persianTitle: "تبریز",
                count: null
            },
            {
                title: "talesh",
                cover: "talesh.webp",
                persianTitle: "تالش",
                count: null
            },
            {
                title: "tehran",
                cover: "tehran.webp",
                persianTitle: "تهران",
                count: null
            },
        ]

        const cityCounts = villas.reduce((acc, villa) => {
            const city = villa.address.city;
            const state = villa.address.state;
            acc[city] = (acc[city] || 0) + 1;
            acc[state] = (acc[state] || 0) + 1;
            return acc;
        }, {});

        const sortedCities = city.map((city) => ({
            ...city,
            count: cityCounts[city.persianTitle] || 0,
        })).sort((a, b) => b.count - a.count);

        return res.status(200).json({ statusCode: 200, sortedCities })

    } catch (err) { return res.status(500).json({ statusCode: 500, message: err.message }); }
}
exports.quickSearchByZone = async (req, res) => {
    try {

        const villas = await villaModel.find({ finished: true, isAccepted: "true" }).populate("aboutVilla.villaType").populate("user", "firstName lastName role avatar").lean();

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

        const villasByZone = villas.reduce((acc, villa) => {
            const zone = villa.aboutVilla.villaZone;
            acc[zone] = (acc[zone] || 0) + 1;
            return acc;
        }, {});

        const orderedVillas = allZone.map((zone) => ({
            ...zone,
            count: villasByZone[zone.title] || 0,
        })).sort((a, b) => b.count - a.count);


        return res.status(200).json({ statusCode: 200, orderedVillas })

    } catch (err) { return res.status(500).json({ statusCode: 500, message: err.message }); }
}
exports.accessVisit = async (req, res) => {
    try {

        const { key, villaID } = req.params

        if (key !== "accept" && key !== "reject") {
            return res.status(400).json({ statusCode: 400, message: "Invalid key. Only 'accept' or 'reject' is allowed." });
        }
        const validate = mongoose.Types.ObjectId.isValid(villaID);
        if (!validate) return res.status(401).json({ statusCode: 401, message: 'Invalid Object Id' })

        const villa = await villaModel.find({ _id: villaID })
        if (!villa) return res.status(404).json({ statusCode: 404, message: "villa not found 404 !" })

        if (key == "accept") await villaModel.updateOne({ _id: villaID }, { isAccepted: "true" })
        else if (key == "reject") await villaModel.updateOne({ _id: villaID }, { isAccepted: "rejected" })

        return res.status(200).json({ statusCode: 200, message: "succ" })

    } catch (err) {
        return res.status(500).json({ statusCode: 500, message: err.message });
    }
}
exports.getAllBooks = async (req, res) => {
    try {

        const books = await reserveModel.find({})

        return res.status(200).json({ statusCode: 200, books })

    } catch (err) {
        return res.status(500).json({ statusCode: 500, message: err.message });
    }
}
exports.getAllRejectedVillas = async (req, res) => {
    try {

        const rejectedVillas = await villaModel.find({ isAccepted: "rejected" }).lean()

        return res.status(200).json({ statusCode: 200, rejectedVillas })

    } catch (err) {
        return res.status(500).json({ statusCode: 500, message: err.message });
    }
}