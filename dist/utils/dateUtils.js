"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.addDays = addDays;
exports.addMonths = addMonths;
exports.getNextOccurrence = getNextOccurrence;
exports.formatDateToISO = formatDateToISO;
exports.isWithinThreeHours = isWithinThreeHours;
exports.formatTime = formatTime;
exports.getNextDateForDayOfWeek = getNextDateForDayOfWeek;
function addDays(date, days) {
    const result = new Date(date);
    result.setDate(result.getDate() + days);
    return result;
}
function addMonths(date, months) {
    const result = new Date(date);
    result.setMonth(result.getMonth() + months);
    return result;
}
function getNextOccurrence(tipo, currentDate) {
    switch (tipo) {
        case 'semanal':
            return addDays(currentDate, 7);
        case 'quinzenal':
            return addDays(currentDate, 14);
        case 'mensal':
            return addMonths(currentDate, 1);
        default:
            throw new Error(`Tipo de recorrência inválido: ${tipo}`);
    }
}
function formatDateToISO(date) {
    return date.toISOString();
}
function isWithinThreeHours(consultaDataHora) {
    const now = new Date();
    const consultaDate = new Date(consultaDataHora);
    const diffInMs = consultaDate.getTime() - now.getTime();
    const diffInHours = diffInMs / (1000 * 60 * 60);
    return diffInHours <= 3 && diffInHours >= 2.83;
}
function formatTime(date) {
    return date.toLocaleTimeString('pt-BR', {
        hour: '2-digit',
        minute: '2-digit',
        timeZone: 'America/Sao_Paulo'
    });
}
function getNextDateForDayOfWeek(dayOfWeek, time) {
    const now = new Date();
    const [hours, minutes] = time.split(':').map(Number);
    const result = new Date(now);
    result.setHours(hours, minutes, 0, 0);
    const currentDay = now.getDay();
    let daysUntilNext = dayOfWeek - currentDay;
    if (daysUntilNext < 0) {
        daysUntilNext += 7;
    }
    else if (daysUntilNext === 0 && now.getTime() > result.getTime()) {
        daysUntilNext = 7;
    }
    result.setDate(result.getDate() + daysUntilNext);
    return result;
}
