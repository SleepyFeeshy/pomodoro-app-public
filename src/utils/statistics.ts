import { getDataPastThreeDays } from "./databaseManagement.js";

export async function getAveragePastThreeDays() {
  const value = await getDataPastThreeDays()
  // console.log(value)
  const average = value.length/3
  // console.log("average: " + average)
  return average;
}