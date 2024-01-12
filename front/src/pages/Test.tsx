import { useState } from 'react';

import { MultiSelect } from 'primereact/multiselect';
import { Option, Select } from '@material-tailwind/react';

const Test = () => {
  const [selectedCities, setSelectedCities] = useState([
    { name: 'Paris1', code: 'PRS' },
    { name: 'Paris2', code: 'PRS' },
    { name: 'Paris3', code: 'PRS' },
  ]);
  const cities = [
    { name: 'New York', code: 'NY' },
    { name: 'Rome', code: 'RM' },
    { name: 'London', code: 'LDN' },
    { name: 'Istanbul', code: 'IST' },
    { name: 'Paris', code: 'PRS' },
    { name: 'Paris1', code: 'PRS' },
    { name: 'Paris2', code: 'PRS' },
    { name: 'Paris3', code: 'PRS' },
    { name: 'Paris4', code: 'PRS' },
    { name: 'Paris5', code: 'PRS' },
    { name: 'Paris6', code: 'PRS' },
    { name: 'Paris7', code: 'PRS' },
    { name: 'Paris8', code: 'PRS' },
    { name: 'Paris9', code: 'PRS' },
    { name: 'Paris10', code: 'PRS' },
    { name: 'Paris11', code: 'PRS' },
    { name: 'Paris12', code: 'PRS' },
    { name: 'Paris13', code: 'PRS' },
    { name: 'Paris14', code: 'PRS' },
    { name: 'Paris15', code: 'PRS' },
    { name: 'Paris16', code: 'PRS' },
    { name: 'Paris17', code: 'PRS' },
    { name: 'Paris18', code: 'PRS' },
    { name: 'Paris19', code: 'PRS' },
    { name: 'Paris20', code: 'PRS' },
    { name: 'Paris21', code: 'PRS' },
  ];
  return (
    <div className="mx-auto mt-10 h-max w-full max-w-5xl rounded-2xl bg-white p-8 shadow-soft-xl">
      <div className="mx-auto max-w-max">
        <Select
          name="matricule_utilisateur"
          value={'ST11'}
          // onChange={(val) => val && handleSelectChange(val)}
          variant="outlined"
          label="Matricule"
        >
          <Option value={'ST11'}>{'ST11'}</Option>
        </Select>
      </div>
      <div className="flex flex-col gap-4 text-body">
        <h5 className="text-lg">Préférences :</h5>
        <div className="rounded-2xl border p-4">
          <MultiSelect
            value={selectedCities}
            onChange={(e) => setSelectedCities(e.value)}
            options={cities}
            optionLabel="name"
            display="chip"
            filter
            placeholder="Sélectionnez les préférences alimentaires..."
            className="w-full"
          />
        </div>
        <h5 className="text-lg">Restrictions :</h5>
        <div className="rounded-2xl border p-4">
          <MultiSelect
            value={selectedCities}
            onChange={(e) => setSelectedCities(e.value)}
            options={cities}
            optionLabel="name"
            display="chip"
            filter
            placeholder="Sélectionnez les restrictions alimentaires..."
            className="w-full"
          />
        </div>
      </div>
    </div>
  );
};

export default Test;
