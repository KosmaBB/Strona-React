import csv
def load_csv(file_path):
    data = []
    with open(file_path, mode='r', encoding='utf-8') as file:
        reader = csv.DictReader(file, delimiter=';')
        for row in reader:
            data.append(row)
    return data

def process_terc_data(terc_data):
    wojewodztwa = {}
    for row in terc_data:
        if row['RODZ'] == 'województwo':
            wojewodztwa[row['WOJ']] = row['NAZWA']
    return wojewodztwa

def process_simc_data(simc_data):
    miejscowosci = {}
    for row in simc_data:
        miejscowosci[row['SYM']] = row['NAZWA']
    return miejscowosci

def find_miejscowosc_by_sym(miejscowosci, sym):
    return miejscowosci.get(sym, "Nieznana miejscowość")

def find_wojewodztwo_by_woj(wojewodztwa, woj):
    return wojewodztwa.get(woj, "Nieznane województwo")

def main():
    try:
        terc_path = 'TERC.csv'
        simc_path = 'SIMC.csv'

        terc_data = load_csv(terc_path)
        simc_data = load_csv(simc_path)

        wojewodztwa = process_terc_data(terc_data)
        miejscowosci = process_simc_data(simc_data)

        print("Województwa:")
        for woj, nazwa in wojewodztwa.items():
            print(f"{woj}: {nazwa}")

        print("\nMiejscowości:")
        for sym, nazwa in miejscowosci.items():
            print(f"{sym}: {nazwa}")

        miejscowosc_sym = '0201011'
        woj_sym = '02'

        print(f"\nMiejscowość o symbolu {miejscowosc_sym}: {find_miejscowosc_by_sym(miejscowosci, miejscowosc_sym)}")
        print(f"Województwo o symbolu {woj_sym}: {find_wojewodztwo_by_woj(wojewodztwa, woj_sym)}")

    except Exception as e:
        print(f"Wystąpił błąd: {e}")

if __name__ == "__main__":
    main()