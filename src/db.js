import dayjs from 'dayjs';
import fs from 'fs/promises';

let pathname = decodeURIComponent(new URL('./db.json', import.meta.url).pathname);
pathname = pathname.substring(1);
export async function saveData(data) {
    await fs.writeFile(pathname, JSON.stringify(data, null, 2));
}

export async function loadData() {
    const data = await fs.readFile(pathname, 'utf-8');
    return JSON.parse(data);
}
export async function addTransaction(transaction) {
    const data = await loadData();
    transaction.id = data.expenses.length + 1;
    transaction.date = new dayjs().format('YYYY-MM-DD');
    data.expenses.push(transaction);
    await saveData(data);
}
export async function deleteTransaction(id) {
    const data = await loadData();
    const newData = data.expenses.filter((element) => element.id !== id);
    data.expenses = newData;
    await saveData(data);
}