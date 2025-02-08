const fs = require('fs');
const csv = require('csv-parser');

const wojewodztwa = [];
const powiaty = [];
const gminy = [];

fs.createReadStream('TERC.csv')
  .pipe(csv({ separator: ';' }))
  .on('data', (row) => {
    console.log("Wczytany wiersz z TERC:", row); 
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
    console.log('Województwa:', wojewodztwa); 
    console.log('Powiat:', powiaty); 
    console.log('Gminy:', gminy); 
  });

const miejscowosci = [];
fs.createReadStream('SIMC.csv')
  .pipe(csv({ separator: ';' }))
  .on('data', (row) => {
    console.log("Wczytany wiersz z SIMC:", row); 
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
    console.log('Miejscowości:', miejscowosci); 
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

    console.log("Dane do zapisania:", miastaWedlugWojewodztw); 
    fs.writeFileSync('/Users/Kosmo/Documents/React/mapa-polski/src/components/cities.json', JSON.stringify(miastaWedlugWojewodztw, null, 2));
    console.log("Plik cities.json został utworzony.");
  });