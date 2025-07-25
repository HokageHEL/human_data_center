// Person field definitions for completion percentage calculation

export const REQUIRED_PERSON_FIELDS = [
  "fullName",
  "passportNumber",
  "taxId",
  "registrationPlace",
  "address",
  "familyStatus",
  "relatives",
  "education",
  "gender",
  "birthDate",
  "phoneNumber",

  "position",
  "militaryRank",
  "positionRank",
  "unit",
  "department",
  "militarySpecialty",
  "tariffCategory",
  "salary",
  "serviceType",
  "serviceStartDate",
  "servicePeriods",
  "previousServicePlaces",
  "militaryDocumentNumber",
  "shpoNumber",
  "unitStartDate",
] as const;

export const OPTIONAL_PERSON_FIELDS = [
  "photo",
  "lastRankDate",
  "fitnessStatus",
  "medicalCommissionNumber",
  "medicalCommissionDate",
  "contractEndDate",
  "combatExperienceNumber",
  "combatPeriods",
  "additionalInfo",
  "unitStartDate",
  "documents",
  "isInPPD",
  "deleted",
  "status",
  "combatExperienceStatus",
  "BMT",
  "BMTUnit",
  "professionCourse",
  "professionCourseValue",
] as const;

// Type definitions
export type RequiredPersonField = (typeof REQUIRED_PERSON_FIELDS)[number];
export type OptionalPersonField = (typeof OPTIONAL_PERSON_FIELDS)[number];
export type PersonField = RequiredPersonField | OptionalPersonField;

// Helper function to get all person fields
export const getAllPersonFields = (): readonly string[] => {
  return [...REQUIRED_PERSON_FIELDS, ...OPTIONAL_PERSON_FIELDS];
};

// Helper function to check if a field is required
export const isRequiredField = (
  field: string
): field is RequiredPersonField => {
  return REQUIRED_PERSON_FIELDS.includes(field as RequiredPersonField);
};

// Helper function to check if a field is optional
export const isOptionalField = (
  field: string
): field is OptionalPersonField => {
  return OPTIONAL_PERSON_FIELDS.includes(field as OptionalPersonField);
};
