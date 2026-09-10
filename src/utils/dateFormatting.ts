export function toLocalISOString(date = new Date()) {
  const offsetMs = date.getTimezoneOffset() * 60000; // Offset in milliseconds
  const localDate = new Date(date - offsetMs);
  // return localDate.toISOString().slice(0, 19).replace('T', ' ');
  return localDate.toISOString();
}

export function toRFC3339WithOffset(date = new Date()) {
  const offsetMinutes = date.getTimezoneOffset();
  const offsetHours = Math.floor(Math.abs(offsetMinutes) / 60);
  const offsetMinutesRemainder = Math.abs(offsetMinutes) % 60;
  const sign = offsetMinutes > 0 ? '-' : '+';

  // const isoString = date.toISOString().slice(0, -1); // Remove trailing 'Z'
  const isoString = toLocalISOString().slice(0, -1);
  return `${isoString}${sign}${String(offsetHours).padStart(2, '0')}:${String(offsetMinutesRemainder).padStart(2, '0')}`;
}

const getFormattedDate = () => {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, '0');
  const day = String(today.getDate()).padStart(2, '0');
  return `${year}${month}${day}`;
};

// export function setPixelaPixelValue(inputValue) {
//   // set pixel to work timer + 1
//   const pomodoro_graph_endpoint = `https://pixe.la/v1/users/zach11789/graphs/pomodoro1`
//   const today_id = getFormattedDate();
//   const pixela_token = import.meta.env.VITE_PIXELA_TOKEN;
//   const pixelaHeader = {
//     "X-USER-TOKEN": pixela_token,
//   }

//   const pixela_params = {
//     "date": today_id,
//     "quantity": String(inputValue),
//     "optionalData": JSON.stringify({
//       "Time spent working": "20 mins"
//     })
//   }

//   const response = async () => {
//     await fetch(pomodoro_graph_endpoint, {
//       method: "POST",
//       headers: {
//         "X-USER-TOKEN": pixela_token,
//         'Content-Type': 'application/json'
//       },
//       body: JSON.stringify(pixela_params),
//     })
//   }
//   response()
// }