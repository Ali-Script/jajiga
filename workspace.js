const JalaliDate = require('jalali-date');


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

    console.log(`Start Date: ${currentDate}`);
    console.log(`End Date: ${end}`);

    while (currentDate <= end) {
        const dayOfWeek = currentDate.getDay();
        console.log(`Current Date: ${currentDate}, Day of Week: ${dayOfWeek}`);

        if (dayOfWeek === 4) {
            thursdays++;
        } else if (dayOfWeek === 5) {
            fridays++;
        }
        currentDate.setDate(currentDate.getDate() + 1);
    }

    return { thursdays, fridays };
}


let dateRange = { from: "1403/6/1", to: "1403/6/6" };
let result = countThursdaysAndFridays(dateRange);
console.log(`Thursdays: ${result.thursdays}, Fridays: ${result.fridays}`);