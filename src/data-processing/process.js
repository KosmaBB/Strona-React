const fs = require('fs');
const csv = require('csv-parser');

const wojewodztwaMap = {
  "02": 7, //  Dolnośląskie
  "04": 5, //  Kujawsko-pomorskie
  "06": 14, // Lubelskie
  "08": 15, // Lubuskie
  "10": 12, // Łódzkie
  "12": 9, // Małopolskie
  "14": 13, // Mazowieckie
  "16": 6, // Opolskie
  "18": 8, // Podkarpackie
  "20": 6, // Podlaskie
  "22": 10, // Pomorskie
  "24": 0, // Śląskie
  "26": 4, //  Świętokrzyskie
  "28": 11, // Warmińsko-mazurskie
  "30": 2, //  Wielkopolskie
  "32": 3 //   Zachodniopomorskie
};

const wojewodztwa = [];
const miejscowosci = [];
const powiaty = [];
const gminy = [];

const logData = (data, description) => {
  console.log(description, JSON.stringify(data, null, 2));
};

fs.createReadStream('SIMC.csv')
  .pipe(csv({ separator: ';', headers: ['WOJ', 'POW', 'GMI', 'RODZ_GMI', 'RM', 'MZ', 'NAZWA', 'SYM', 'SYMPOD', 'STAN_NA'] }))
  .on('data', (row) => {
    if (row.NAZWA && row.WOJ) {
      const wojewodztwoId = wojewodztwaMap[row.WOJ.padStart(2, '0')];
      console.log(`WOJ: ${row.WOJ}, id: ${wojewodztwoId}`);
      miejscowosci.push({
        wojewodztwo: row.WOJ,
        powiat: row.POW,
        gmina: row.GMI,
        nazwa: row.NAZWA,
        MZ: row.MZ === '1' ? 1 : 0
      });
    }
  })
  .on('end', () => {
    logData(miejscowosci, 'Miejscowości:');

    const miastaWedlugWojewodztw = miejscowosci.reduce((acc, miejscowosc) => {
      const wojewodztwoId = miejscowosc.id;
      if (!acc[wojewodztwoId]) {
        acc[wojewodztwoId] = [];
      }
      acc[wojewodztwoId].push({
        nazwa: miejscowosc.nazwa,
        MZ: miejscowosc.MZ
      });
      return acc;
    }, {});

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