export const daysLeft = (endAt) => {
  const timestamp = parseInt(endAt) * 1000;
    const difference = new Date(timestamp).getTime() - Date.now();
    const remainingDays = difference / (1000 * 60 * 60 * 24);
    return remainingDays.toFixed(0);
  };

  export const startDays = (startAt) => {
    const date = new Date(startAt * 1000);
    const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();
  const formattedDate = `${day}-${month}-${year}`;
  return formattedDate;
  }

  export const endDays = (endAt) => {
    const date = new Date(endAt * 1000);
    const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();
  const formattedEndDate = `${day}-${month}-${year}`;
  return formattedEndDate;
  }