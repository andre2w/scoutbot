export const ONE_MINUTE = 1_000 * 60;
export const TWO_MINUTES = 1_000 * 60 * 2;
export const FIVE_MINUTES = 1_000 * 60 * 5;

export function getWaitTime() {
    const timeNow = new Date();

    if (timeNow.getHours() >= 6 && timeNow.getHours() <= 13) {
        return ONE_MINUTE;
    }

    if (timeNow.getHours() <= 20) {
        return TWO_MINUTES;
    }

    return FIVE_MINUTES;
}