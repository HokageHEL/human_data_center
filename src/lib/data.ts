const API_BASE_URL = 'http://localhost:3000/api';

export type Document = {
  id: string;
  personFullName: string;
  name: string;
  type: string;
  data: string;
  uploadDate: string;
};

export type Person = {
  fullName: string;
  passportNumber: string;
  taxId: string;
  registrationPlace: string;
  address: string;
  familyStatus: string;
  relatives: string;
  education: string;
  gender: 'Ч' | 'Ж';
  birthDate: string;
  phoneNumber: string;
  photo: string;
  additionalInfo: string;
  position: string;
  militaryRank: string;
  lastRankDate: string;
  positionRank: string;
  fitnessStatus: 'придатний' | 'обмежено придатний';
  medicalCommissionNumber: string;
  medicalCommissionDate: string;
  unit: string;
  department: string;
  militarySpecialty: string;
  tariffCategory: number;
  salary: number;
  serviceType: 'мобілізація' | 'контракт';
  serviceStartDate: string;
  servicePeriods: string;
  unitStartDate: string;
  previousServicePlaces: string;
  contractEndDate: string;
  militaryDocumentNumber: string;
  shpoNumber: string;
  combatExperienceStatus: boolean;
  combatExperienceNumber: string;
  combatPeriods: string;
  isInPPD: boolean;
  status: 'не_вказано' | 'відпустка' | 'короткострокове_лікування' | 'довгострокове_лікування' | 'відрядження' | 'декрет' | 'РВБД' | 'навчання';
  deleted: boolean;
  documents: Document[];
};

export async function writePerson(person: Person, oldName?: string): Promise<void> {
  const url = `${API_BASE_URL}/people${oldName ? `?oldName=${encodeURIComponent(oldName)}` : ''}`;
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(person),
  });

  if (!response.ok) {
    throw new Error(`Failed to write person: ${response.statusText}`);
  }
}

export async function addPerson(person: Person): Promise<void> {
  await writePerson(person);
}

export async function getPerson(fullName: string): Promise<Person | null> {
  const response = await fetch(`${API_BASE_URL}/people/${encodeURIComponent(fullName)}`);
  
  if (!response.ok) {
    if (response.status === 404) {
      return null;
    }
    throw new Error(`Failed to get person: ${response.statusText}`);
  }

  return response.json();
}

export async function getActivePeople(): Promise<Person[]> {
  const response = await fetch(`${API_BASE_URL}/people`);
  
  if (!response.ok) {
    throw new Error(`Failed to get people: ${response.statusText}`);
  }

  return response.json();
}

export async function deletePerson(fullName: string): Promise<void> {
  const response = await fetch(`${API_BASE_URL}/people/${encodeURIComponent(fullName)}`, {
    method: 'DELETE',
  });

  if (!response.ok) {
    throw new Error(`Failed to delete person: ${response.statusText}`);
  }
}