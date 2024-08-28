const { date } = req.body;

const validator = joi.validate({ villa: villaID, date });
if (validator.error) return res.status(409).json({ statusCode: 409, message: validator.error.details });

let from = date.from;
let to = date.to;
let splitedFrom = from.split("/").join('');
let splitedTo = to.split("/").join('');

if (+splitedFrom >= +splitedTo) return res.status(402).json({ statusCode: 402, message: "date>to should be greater than date>from" });

const villa = await villaModel.findOne({ _id: villaID });
if (!villa) return res.status(404).json({ statusCode: 404, message: "Villa not found 404 !" });

function persianToGregorian(persianDate) {
    const [year, month, day] = persianDate.split('/').map(Number);
    const jd = new JalaliDate(year, month, day);
    return jd.toGregorian();
}

function countDaysAndWeekdays(dateRange) {
    const startDate = persianToGregorian(dateRange.from);
    const endDate = persianToGregorian(dateRange.to);

    let currentDate = new Date(startDate);
    const end = new Date(endDate);

    let monthDays = {};
    while (currentDate <= end) {
        const persianDate = new JalaliDate(currentDate);
        const month = persianDate.month();
        const dayOfWeek = currentDate.getDay();

        if (!monthDays[month]) {
            monthDays[month] = { days: 0, thursdays: 0, fridays: 0 };
        }

        monthDays[month].days++;
        if (dayOfWeek === 4) {
            monthDays[month].thursdays++;
        } else if (dayOfWeek === 5) {
            monthDays[month].fridays++;
        }

        currentDate.setDate(currentDate.getDate() + 1);
    }

    return monthDays;
}

let dateRange = { from, to };
let result = countDaysAndWeekdays(dateRange);

res.json(result);
