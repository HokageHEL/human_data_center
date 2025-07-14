import { Document, Paragraph, TextRun, Table, TableRow, TableCell, BorderStyle, WidthType } from 'docx';
import * as XLSX from 'xlsx';

interface PersonData {
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
  position: string;
  militaryRank: string;
  positionRank: string;
  fitnessStatus: string;
  medicalCommissionInfo: string;
  unit: string;
  department: string;
  militarySpecialty: string;
  tariffCategory: number;
  salary: number;
  serviceType: string;
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
}

const createTableRow = (label: string, value: string): TableRow => {
  return new TableRow({
    children: [
      new TableCell({
        children: [new Paragraph({ children: [new TextRun({ text: label, bold: true })] })],
        width: {
          size: 30,
          type: WidthType.PERCENTAGE,
        },
      }),
      new TableCell({
        children: [new Paragraph({ children: [new TextRun({ text: value })] })],
        width: {
          size: 70,
          type: WidthType.PERCENTAGE,
        },
      }),
    ],
  });
};

export const generateTableDocument = (people: Partial<PersonData>[], columns: { field: string; label: string }[]): Document => {
  const doc = new Document({
    sections: [{
      properties: {},
      children: [
        new Table({
          width: { size: 100, type: WidthType.PERCENTAGE },
          rows: [
            new TableRow({
              children: columns.map(col => 
                new TableCell({
                  children: [new Paragraph({ children: [new TextRun({ text: col.label, bold: true })] })],
                  width: { size: 100 / columns.length, type: WidthType.PERCENTAGE },
                })
              ),
            }),
            ...people.map(person => 
              new TableRow({
                children: columns.map(col => 
                  new TableCell({
                    children: [new Paragraph({ children: [new TextRun({ text: String(person[col.field as keyof PersonData] || '') })] })],
                    width: { size: 100 / columns.length, type: WidthType.PERCENTAGE },
                  })
                ),
              })
            ),
          ],
        }),
      ],
    }],
  });
  return doc;
};

export const exportToExcel = (people: Partial<PersonData>[], columns: { field: string; label: string }[]): Uint8Array => {
  const worksheet = XLSX.utils.json_to_sheet(
    people.map(person => 
      columns.reduce((obj, col) => ({
        ...obj,
        [col.label]: person[col.field as keyof PersonData]
      }), {})
    )
  );
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'People');
  return XLSX.write(workbook, { type: 'array', bookType: 'xlsx' });
};

export const generatePersonDocument = (person: PersonData): Document => {
  const doc = new Document({
    sections: [
      {
        properties: {},
        children: [
          new Paragraph({
            children: [
              new TextRun({
                text: 'ОСОБОВА КАРТКА ВІЙСЬКОВОСЛУЖБОВЦЯ',
                bold: true,
                size: 28,
              }),
            ],
            alignment: 'center',
            spacing: { after: 400 },
          }),
          new Table({
            width: {
              size: 100,
              type: WidthType.PERCENTAGE
            },
            columnWidths: [8500, 8500],
            rows: [
              new TableRow({
                children: [
                  new TableCell({
                    children: [
                      new Paragraph({
                        children: [new TextRun({ text: 'ЗАГАЛЬНІ ДАНІ', bold: true, size: 24 })],
                        spacing: { after: 200 },
                      }),
                      new Table({
                        width: {
                          size: 100,
                          type: WidthType.PERCENTAGE
                        },
                        borders: {
                          top: { style: BorderStyle.SINGLE, size: 1 },
                          bottom: { style: BorderStyle.SINGLE, size: 1 },
                          left: { style: BorderStyle.SINGLE, size: 1 },
                          right: { style: BorderStyle.SINGLE, size: 1 },
                          insideHorizontal: { style: BorderStyle.SINGLE, size: 1 },
                          insideVertical: { style: BorderStyle.SINGLE, size: 1 },
                        },
                        rows: [
                          createTableRow('П.І.Б.', person.fullName),
                          createTableRow('Номер та серія паспорта', person.passportNumber),
                          createTableRow('ІПН', person.taxId),
                          createTableRow('Місце реєстрації', person.registrationPlace),
                          createTableRow('Адреса проживання', person.address),
                          createTableRow('Сімейний стан', person.familyStatus),
                          createTableRow('Родичі', person.relatives),
                          createTableRow('Освіта', person.education),
                          createTableRow('Стать', person.gender === 'Ч' ? 'Чоловіча' : 'Жіноча'),
                          createTableRow('Дата народження', person.birthDate),
                          createTableRow('Номер телефону', person.phoneNumber),
                        ],
                      }),
                    ],
                    width: {
                      size: 50,
                      type: WidthType.PERCENTAGE
                    },
                  }),
                  new TableCell({
                    children: [
                      new Paragraph({
                        children: [new TextRun({ text: 'ВІЙСЬКОВІ ДАНІ', bold: true, size: 24 })],
                        spacing: { after: 200 },
                      }),
                      new Table({
                        width: {
                          size: 100,
                          type: WidthType.PERCENTAGE
                        },
                        borders: {
                          top: { style: BorderStyle.SINGLE, size: 1 },
                          bottom: { style: BorderStyle.SINGLE, size: 1 },
                          left: { style: BorderStyle.SINGLE, size: 1 },
                          right: { style: BorderStyle.SINGLE, size: 1 },
                          insideHorizontal: { style: BorderStyle.SINGLE, size: 1 },
                          insideVertical: { style: BorderStyle.SINGLE, size: 1 },
                        },
                        rows: [
                          createTableRow('Посада', person.position),
                          createTableRow('Військове звання', person.militaryRank),
                          createTableRow('Військове звання (за посадою)', person.positionRank),
                          createTableRow('Придатність до військової служби', person.fitnessStatus),
                          createTableRow('Підрозділ', person.unit),
                          createTableRow('Відділ', person.department),
                          createTableRow('ВОС', person.militarySpecialty),
                          createTableRow('Тарифний розряд', person.tariffCategory.toString()),
                          createTableRow('Оклад', person.salary.toString()),
                          createTableRow('Тип служби', person.serviceType),
                          createTableRow('Дата призову / укладення контракту', person.serviceStartDate),
                          createTableRow('Періоди проходження служби', person.servicePeriods),
                          createTableRow('У військовій частині з', person.unitStartDate),
                          createTableRow('Попередні місця служби', person.previousServicePlaces),
                          person.serviceType === 'контракт' ? createTableRow('Дата закінчення контракту', person.contractEndDate) : null,
                          createTableRow('Номер військового документа', person.militaryDocumentNumber),
                          createTableRow('Номер ШПО', person.shpoNumber),
                          createTableRow('УБД', person.combatExperienceStatus ? 'Так' : 'Ні'),
                          person.combatExperienceStatus ? createTableRow('№ УБД', person.combatExperienceNumber) : null,
                          createTableRow('Періоди участі у бойових діях', person.combatPeriods),
                          createTableRow('ППД', person.isInPPD ? 'Так' : 'Ні'),
                        ].filter(Boolean) as TableRow[],
                      }),
                    ],
                    width: {
                      size: 50,
                      type: WidthType.PERCENTAGE
                    },
                  }),
                ],
              }),
            ],
          }),
        ],
      },
    ],
  });

  return doc;
};