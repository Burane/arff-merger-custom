const fs = require('fs')
const readline = require('readline');
const fileName = 'allData.arff'

let header = [];
let equipes = []
let trueEquipe = []
let line1, line2

main().catch(err => console.error(err))

async function main() {

    let firstdata = fs.readFileSync(`arffs/${2000+8}/gamesAdvancedStats-StdDevs.arff`)
    fs.writeFileSync(fileName, firstdata)

    for (let i = 9; i < 18; i++)
        await readData(i)

    await readEquipes()

    header.push(line1)
    header.push(line2)

    header.forEach(line => {
        equipes.push(JSON.parse(line.substring("@attribute name1 ".length).replace(/'/g, '"').replace(/{/g, "[").replace(/}/g, "]")))
    })

    equipes.forEach(array => {
        array.forEach(object => {
            if (!trueEquipe.includes(object))
                trueEquipe.push(object)
        })
    })

    let str1 = "@attribute name1 {"
    trueEquipe.forEach((elem, index) => {
        str1 += `'${elem}'`
        str1 += trueEquipe.length == index + 1 ? "" : ","
    })
    str1 += "}"

    let str2 = str1.replace(/name1/g, 'name2')
    let data = fs.readFileSync(fileName)
    let re = new RegExp('^.*' + line1 + '.*$', 'gm');
    let re2 = new RegExp('^.*' + line2 + '.*$', 'gm');
    let formatted = data.toString().replace(re, str1);
    let fomat2 = formatted.replace(re2, str2);
    fs.writeFileSync(fileName, fomat2)
}

function readData(i) {
    return new Promise((resolve, reject) => {
        const readInterface = readline.createInterface({
            input: fs.createReadStream(`arffs/${2000+i}/gamesAdvancedStats-StdDevs.arff`),
            console: false
        })

        let read = false

        readInterface.on('line', (line) => {
            if (read)
                fs.writeFileSync(fileName, line + "\n", {
                    flag: 'a'
                })
            if (line == "@data")
                read = true;
            if (line.startsWith("@attribute name1 ") || line.startsWith('@attribute name2 '))
                header.push(line)
        })

        readInterface.on("close", resolve)
    })
}

function readEquipes() {
    return new Promise((resolve, reject) => {

        const readInterface = readline.createInterface({
            input: fs.createReadStream(fileName),
            console: false
        })

        readInterface.on('line', (line) => {
            if (line.startsWith("@attribute name1 "))
                line1 = line
            if (line.startsWith('@attribute name2 '))
                line2 = line
        })

        readInterface.on('close', resolve)
    })
}