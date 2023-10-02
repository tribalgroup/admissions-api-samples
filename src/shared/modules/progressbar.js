const readline = require('readline');
function updateProgressBar(message, current, totalCount) {


    const progressBarWidth = 70;
    const progressBarChar = "█";
    const emptyChar = " ";

    const progress = Math.floor((current / totalCount) * 100);
    const filledChars = Math.floor((progressBarWidth / 100) * progress);
    const emptyChars = Math.floor((progressBarWidth / 100) * (100 - progress));

    const progressBar = `${progressBarChar.repeat(filledChars)}${emptyChar.repeat(emptyChars)}`;

    const rl = readline.createInterface({ input: process.stdin, output: process.stdout });

    // Move the cursor to the beginning of the line and clear the line
    rl.write(null,{ ctrl:true, name:'u'});
    rl.write(`[${progressBar}] ${progress}% > ${message}`);

    // Close the readline interface
    rl.close();
}

module.exports = {
    updateProgressBar: updateProgressBar
}