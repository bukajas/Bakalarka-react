export const DateFormater = function(date){ // format yyyy-mm-dd HH:MM:SS
    const datum = {
        year: Number(date.split('-')[0]),
        month: Number(date.split('-')[1]) -1,
        day: Number(date.split('-')[2].split(' ')[0]),
        hour: Number(date.split(':')[0].split(' ')[1]),
        minute: Number(date.split(' ')[1].split(':')[1]),
        second: Number(date.split(' ')[1].split(':')[2])}
  return datum
}
export default DateFormater