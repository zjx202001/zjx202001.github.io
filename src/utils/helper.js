/**
 * 截短时间戳
 * @param v
 * @param time
 * @returns {number}
 */
export function truncate (v, time) {
  if (!time) {
    time = parseInt(new Date().getTime() / 1000)
  }
  return time - time % v
}