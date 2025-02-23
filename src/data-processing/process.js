const fs = require('fs');
const csv = require('csv-parser');

const wojewodztwaMap = {
  "10": 12, // Łódzkie
  "12": 9,  // Małopolskie
  "14": 13, // Mazowieckie
  "16": 1,  // Opolskie
  "18": 8,  // Podkarpackie
  "20": 6,  // Podlaskie
  "22": 10, // Pomorskie
  "24": 0,  // Śląskie
  "26": 4,  // Świętokrzyskie
  "28": 11, // Warmińsko-mazurskie
  "30": 2,  // Wielkopolskie
  "32": 3,  // Zachodniopomorskie
  "02": 7,  // Dolnośląskie
  "04": 5,  // Kujawsko-pomorskie
  "06": 14, // Lubelskie
  "08": 15  // Lubuskie
};

const readCSV = (filePath, headers) => {
  return new Promise((resolve, reject) => {
    const results = [];
    fs.createReadStream(filePath)
      .pipe(csv({ separator: ';', headers }))
      .on('data', (row) => results.push(row))
      .on('end', () => resolve(results))
      .on('error', (error) => reject(error));
  });
};

const main = async () => {
  try {
    const simcData = await readCSV('SIMC.csv', ['WOJ', 'POW', 'GMI', 'RODZ_GMI', 'RM', 'MZ', 'NAZWA', 'SYM', 'SYMPOD', 'STAN_NA']);
    const miejscowosci = simcData
      .filter((row) => row.NAZWA && row.WOJ)
      .map((row) => ({
        wojewodztwo: row.WOJ,
        nazwa: row.NAZWA
      }));

    const miastaWedlugWojewodztw = miejscowosci.reduce((acc, miejscowosc) => {
      if (!acc[miejscowosc.wojewodztwo]) {
        acc[miejscowosc.wojewodztwo] = new Set();
      }
      acc[miejscowosc.wojewodztwo].add(miejscowosc.nazwa);
      return acc;
    }, {});

    for (const wojewodztwo in miastaWedlugWojewodztw) {
      miastaWedlugWojewodztw[wojewodztwo] = Array.from(miastaWedlugWojewodztw[wojewodztwo]);
    }

    const miastaWedlugWojewodztwNoweId = {};
    for (const staryId in miastaWedlugWojewodztw) {
      const noweId = wojewodztwaMap[staryId];
      if (noweId !== undefined) {
        if (!miastaWedlugWojewodztwNoweId[noweId]) {
          miastaWedlugWojewodztwNoweId[noweId] = [];
        }
        miastaWedlugWojewodztwNoweId[noweId] = miastaWedlugWojewodztwNoweId[noweId].concat(miastaWedlugWojewodztw[staryId]);
      }
    }

    const outputPath = '/Users/Kosmo/Documents/React/mapa-polski/src/components/cities.json';
    fs.writeFileSync(outputPath, JSON.stringify(miastaWedlugWojewodztwNoweId, null, 2));
    console.log(`Plik cities.json został utworzony: ${outputPath}`);
  } catch (error) {
    console.error('Błąd podczas przetwarzania plików CSV:', error);
  }
};

main();