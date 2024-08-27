const mongoose = require('mongoose');
const villaModel = require('./../villas/model');
const reserveModel = require('./../reserve/model');
const commentModel = require('./../comment/model');
const userVilla = require('./../user-villa/model');
const joi = require("./../../validator/villaValidator");
const date = new Date()
const shamsiDate = new Intl.DateTimeFormat('en-US-u-ca-persian', { dateStyle: 'full', timeStyle: 'long' }).format(date)


// const validator = require("email-validator");
const { func } = require('joi');

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

    } catch (err) { return res.status(500).json({ statusCode: 500, error: err.message }); }
}
exports.update = async (req, res) => {
    try {
        const id = req.params.id
        const validate = mongoose.Types.ObjectId.isValid(id);
        if (!validate) return res.status(400).json({ statusCode: 400, error: 'Invalid Object Id' })

        const findVilla = await villaModel.findOne({ _id: id }).lean()
        if (!findVilla) return res.status(401).json({ statusCode: 401, error: 'no villa found with this id' })

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

            const findUpdatedVilla = await villaModel.findOne({ _id: id }).lean()
            return res.status(200).json({ statusCode: 200, message: "Succ !", villa: findUpdatedVilla })
        }

    } catch (err) { return res.status(500).json({ statusCode: 500, error: err.message }); }
}
exports.getAll = async (req, res) => {
    try {
        const villas = await villaModel.find({})
            .populate("user", "firstName lastName role")
            .populate("aboutVilla.villaType")
            .sort({ _id: -1 })
            .lean()
        if (villas.length == 0) return res.status(404).json({ statusCode: 404, message: "there is no villa!" })

        return res.status(200).json({ statusCode: 200, villas: villas })
    } catch (err) { return res.status(500).json({ statusCode: 500, error: err.message }); }
}
exports.getAllActivated = async (req, res) => {
    try {
        const villas = await villaModel.find({ disable: false })
            .populate("user", "firstName lastName role")
            .populate("aboutVilla.villaType")
            .sort({ _id: -1 })
            .lean()
        if (villas.length == 0) return res.status(404).json({ statusCode: 404, message: "there is no Activated villa!" })

        return res.status(200).json({ statusCode: 200, villas: villas })
    } catch (err) { return res.status(500).json({ statusCode: 500, error: err.message }); }
}
exports.getOne = async (req, res) => {
    try {
        const id = req.params.id
        const validate = mongoose.Types.ObjectId.isValid(id);
        if (!validate) return res.status(400).json({ error: 'Invalid Object Id' })

        const villa = await villaModel.findOne({ _id: id })
            .populate("user", "firstName lastName role")
            .populate("aboutVilla.villaType")
            .lean()
        if (!villa) return res.status(404).json({ statusCode: 404, message: "villa not found 404 ! " })

        const getReserved = await reserveModel.find({ villa: villa._id }).sort({ _id: -1 })

        return res.status(200).json({ statusCode: 200, villa, bookedDate: getReserved[0] ? getReserved[0].date : [] })
        // const comments = await commentModel.find({ villa: id, isAccept: 1 })
        //     .populate("villa", "_id title")
        //     .populate("creator", "UserName")
        //     .sort({ _id: -1 })
        //     .lean();

        // let orderedComment = []

        // comments.forEach(mainComment => {
        //     comments.forEach(answerComment => {

        //         if (String(mainComment._id) == String(answerComment.mainCommentID)) {

        //             orderedComment.push({
        //                 ...mainComment,
        //                 villa: answerComment.villa.title,
        //                 creator: answerComment.creator.UserName,
        //                 answerComment
        //             })
        //         }
        //     })
        // })


        // const noAnswerComments = await commentModel.find({ villa: id, isAnswer: 0, haveAnswer: 0 })
        //     .populate("villa", "_id title")
        //     .populate("creator", "UserName")
        //     .sort({ _id: -1 })
        //     .lean();

        // noAnswerComments.forEach(i => orderedComment.push({ ...i }))

        // return res.status(200).json({ villa, comments: orderedComment })
    } catch (err) { return res.status(500).json({ statusCode: 500, error: err.message }); }
}
exports.myVillas = async (req, res) => {
    try {
        const user = req.user
        const villa = await villaModel.find({ user: user._id }).populate("aboutVilla.villaType").lean()
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


        return res.status(200).json({ statusCode: 200, villa })

    } catch (err) { return res.status(500).json({ statusCode: 500, error: err.message }); }
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

    } catch (err) { return res.status(500).json({ statusCode: 500, error: err.message }); }
}
exports.delete = async (req, res) => {
    try {
        const id = req.params.id
        const validate = mongoose.Types.ObjectId.isValid(id);
        if (!validate) return res.status(400).json({ statusCode: 400, error: 'Invalid Object Id' })

        const villa = await villaModel.findOneAndDelete({ _id: id })
        if (!villa) return res.status(404).json({ statusCode: 404, message: "Villa Not Found 404 ! " })

        // const deleteComment = await commentModel.deleteMany({ villa: id })
        const removeuservilla = await userVilla.findOneAndDelete({ villa: id })


        return res.status(200).json({ statusCode: 200, message: "Succ !" })
    } catch (err) { return res.status(500).json({ statusCode: 500, error: err.message }); }
}
exports.filtring = async (req, res) => {
    try {

        const allVillas = await villaModel.find({ finished: true }).populate("aboutVilla.villaType").sort({ _id: -1 }).lean()
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
                return i.capacity.minCapacity >= req.query.gstnum
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
                let AvrgVilla = []
                let Allprice = []

                villas.forEach(villa => {
                    let price = villa.price.newYear +
                        villa.price.spring.midWeek +
                        villa.price.spring.holidays +
                        villa.price.spring.peakDays +
                        villa.price.summer.midWeek +
                        villa.price.summer.holidays +
                        villa.price.summer.peakDays +
                        villa.price.autumn.midWeek +
                        villa.price.autumn.holidays +
                        villa.price.autumn.peakDays +
                        villa.price.winter.midWeek +
                        villa.price.winter.holidays +
                        villa.price.winter.peakDays

                    let x = { id: villa._id, price: price / 13 }
                    Allprice.push(x)
                })
                Allprice = Allprice.sort((a, b) => b.price - a.price);

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
                    let price = villa.price.newYear +
                        villa.price.spring.midWeek +
                        villa.price.spring.holidays +
                        villa.price.spring.peakDays +
                        villa.price.summer.midWeek +
                        villa.price.summer.holidays +
                        villa.price.summer.peakDays +
                        villa.price.autumn.midWeek +
                        villa.price.autumn.holidays +
                        villa.price.autumn.peakDays +
                        villa.price.winter.midWeek +
                        villa.price.winter.holidays +
                        villa.price.winter.peakDays

                    let x = { id: villa._id, price: price / 13 }
                    Allprice.push(x)
                })
                Allprice = Allprice.sort((a, b) => b.price - a.price);

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

        villas.forEach(villa => {
            const trueKeys = Object.keys(villa.facility.facility).filter(key => {
                if (key !== "moreFacility") return villa.facility.facility[key].status === true
            });
            if (trueKeys.length >= 5) villa.costly = true
        })

        return res.status(200).json({ statusCode: 200, villas })
    } catch (err) { return res.status(500).json({ statusCode: 500, error: err.message }); }
}
exports.privilegedVillas = async (req, res) => {
    try {
        let costlyVillas = []
        const villas = await villaModel.find({}).populate("aboutVilla.villaType").lean();

        villas.forEach(villa => {
            const trueKeys = Object.keys(villa.facility.facility).filter(key => {
                if (key !== "moreFacility") return villa.facility.facility[key].status === true
            });
            if (trueKeys.length >= 5) costlyVillas.push(villa)
        })

        return res.status(200).json({ statusCode: 200, villas: costlyVillas })

    } catch (err) { return res.status(500).json({ statusCode: 500, error: err.message }); }
}
exports.popularTowns = async (req, res) => {
    try {
        const villas = await villaModel.find({}).populate("aboutVilla.villaType").lean();

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

    } catch (err) { return res.status(500).json({ statusCode: 500, error: err.message }); }
}
exports.quickSearchByZone = async (req, res) => {
    try {

        const villas = await villaModel.find({}).lean();

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

    } catch (err) { return res.status(500).json({ statusCode: 500, error: err.message }); }
}