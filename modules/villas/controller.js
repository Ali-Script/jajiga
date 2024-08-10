const mongoose = require('mongoose');
const path = require('path');
const fs = require('fs');
const archiver = require('archiver');
const villaModel = require('./../villas/model');
const commentModel = require('./../comment/model');
const userVilla = require('./../user-villa/model');
const joi = require("./../../validator/villaValidator");
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
            finished
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
            .sort({ _id: -1 })
            .lean()
        if (villa.length == 0) return res.status(404).json({ statusCode: 404, message: "villa not found 404 ! " })



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
        return res.status(200).json({ statusCode: 200, villa })
    } catch (err) { return res.status(500).json({ statusCode: 500, error: err.message }); }
}
exports.myVillas = async (req, res) => {
    try {
        const user = req.user
        const villa = await villaModel.find({ user: user._id }).lean()
        if (villa.length == 0) return res.status(404).json({ statusCode: 404, message: "You have`t add villa yet` " })

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

        const allVillas = await villaModel.find({ finished: true }).sort({ _id: -1 }).lean()
        let villas = []

        if (req.query.city) {
            let result = allVillas.filter(i => {
                return i.address.city == req.query.city
            });
            villas.push(result)
            villas = villas[0]
        }
        if (villas.length == 0) return res.status(404).json({ statusCode: 404, villas: [] })
        if (req.query.gstnum) {
            let result = villas.filter(i => {
                return i.capacity.normalCapacity >= req.query.gstnum
            });
            if (result.length == 0) return res.status(404).json({ statusCode: 404, villas: [] })
            villas = result
        }
        if (req.query.minp & req.query.maxp) {

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

                if (x.price <= req.query.maxp) Allprice.push(x)
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