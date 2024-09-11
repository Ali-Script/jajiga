const dates = [
    { date: { from: '1403/7/7', to: '1403/7/9' } },
    { date: { from: '1403/7/1', to: '1403/7/4' } },
    { date: { from: '1403/5/30', to: '1403/6/4' } },
    { date: { from: '1403/5/21', to: '1403/5/26' } }
];

const today = moment().locale('fa').format('YYYY/MM/DD');

const filterDates = (dates, today) => {
    const todayDate = new Date(today.replace(/(\d+)\/(\d+)\/(\d+)/, (match, p1, p2, p3) => `${p1}-${p2}-${p3}`));
    return dates.filter(item => {
        const toDate = new Date(item.date.to.replace(/(\d+)\/(\d+)\/(\d+)/, (match, p1, p2, p3) => `${p1}-${p2}-${p3}`));
        return toDate >= todayDate;
    });
};

const filteredDates = filterDates(dates, today);
console.log(filteredDates);
