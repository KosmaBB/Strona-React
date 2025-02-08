const fs = require('fs');
const csv = require('csv-parser');

const wojewodztwa = [];
const powiaty = [];
const gminy = [];
const miejscowosci = [];

const logData = (data, description) => {
  console.log(description, JSON.stringify(data, null, 2));
};

fs.createReadStream('TERC.csv')
  .pipe(csv({ separator: ';', headers: ['WOJ', 'POW', 'GMI', 'RODZ_GMI', 'NAZWA', 'TYP', 'STAN_NA'] }))
  .on('data', (row) => {
    if (row.NAZWA && row.WOJ) {
      if (row.POW === '00' && row.GMI === '00') {
        wojewodztwa.push({ kod: row.WOJ, nazwa: row.NAZWA });
      } else if (row.GMI === '00') {
        powiaty.push({ kod: row.WOJ + row.POW, nazwa: row.NAZWA });
      } else {
        gminy.push({ kod: row.WOJ + row.POW + row.GMI, nazwa: row.NAZWA });
      }
    }
  })
  .on('end', () => {
    logData(wojewodztwa, 'Województwa:');
    logData(powiaty, 'Powiaty:');
    logData(gminy, 'Gminy:');
  });

fs.createReadStream('SIMC.csv')
  .pipe(csv({ separator: ';', headers: ['WOJ', 'POW', 'GMI', 'RODZ_GMI', 'RM', 'MZ', 'NAZWA', 'SYM', 'SYMPOD', 'STAN_NA'] }))
  .on('data', (row) => {
    if (row.NAZWA && row.WOJ) {
      miejscowosci.push({
        wojewodztwo: row.WOJ,
        powiat: row.POW,
        gmina: row.GMI,
        nazwa: row.NAZWA
      });
    }
  })
  .on('end', () => {
    logData(miejscowosci, 'Miejscowości:');

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

    logData(miastaWedlugWojewodztw, 'Dane do zapisania:');

    const outputPath = '/Users/Kosmo/Documents/React/mapa-polski/src/components/cities.json';
    console.log(`Ścieżka zapisu: ${outputPath}`);

    try {
      fs.writeFileSync(outputPath, JSON.stringify(miastaWedlugWojewodztw, null, 2));
      console.log(`Plik cities.json został utworzony: ${outputPath}`);
    } catch (error) {
      console.error('Błąd podczas zapisywania pliku cities.json:', error);
    }
  });