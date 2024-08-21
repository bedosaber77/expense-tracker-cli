#!/usr/bin/env node
import { Command } from 'commander';
import { addTransaction, deleteTransaction, loadData } from './src/db.js';
const program = new Command();

program.version('0.0.1');

program
    .command('add')
    .requiredOption('-d,--description <description>', 'description', String)
    .requiredOption('-a,--amount <amount>', "amount", parseInt)
    .action((options) => {
        if (options.amount <= 0) {
            console.log("Amount must be greater than 0");
            return;
        }
        const newtransaction = {
            description: options.description,
            amount: options.amount
        };
        addTransaction(newtransaction);
    });
program
    .command('list')
    .action(async () => {
        const data = await loadData();
        console.log("# ID  Date        Description  Amount");
        data.expenses.forEach(element => {
            console.log(`# ${element.id}   ${element.date}  ${element.description.padEnd(12)}  $${element.amount}`);
        });
        console.log('\n');
    });

program
    .command('summary')
    .option('-m, --month <month>', 'month', parseInt)
    .action(async (options) => {
        const data = await loadData();
        let total = 0;
        if (Object.keys(options).length) {
            data.expenses.forEach(element => {
                if (parseInt(element.date.split('-')[1]) === options.month) {
                    total += element.amount;
                };
            });
            const date = new Date();
            date.setMonth(options.month - 1);
            console.log(`Total expenses for month ${date.toLocaleString('en-US', { month: 'long' })}: $${total}`);
        }
        else {
            data.expenses.forEach(element => {
                total += element.amount;
            });
            console.log(`Total expenses : ${total}`)
        }

    });
program
    .command('delete')
    .requiredOption('-i, --id <id>', 'id', parseInt)
    .action(async (options) => {
        deleteTransaction(options.id);
    });


program.parse(process.argv);