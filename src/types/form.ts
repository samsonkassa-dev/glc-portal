
export interface PersonalInfo {
  fullName: string;
  phoneNumber: string;
  city: string;
  subCity: string;
  educationStatus: string;
  workStatus: string;
  jobField: string;
  companyName: string;
  placeOfWork: string;
  placeOfSchool: string;
  fieldOfStudy: string;
}

export interface ChurchInfo1 {
  savedDate: string;
  savedChurch: string;
  inviterFullName?: string;
  inviterPhoneNumber?: string;
  invitationSource?: "Social Media" | "Gospel TV" | undefined;
  doesServe: boolean | undefined;
  department?: string[];
  trainings: string[];
}

export interface ChurchInfo2 {
  maritalStatus: string;
  ministryExperience?: string;
  comments?: string;
  childrenAttendChurch: boolean;
  numberOfChildren?: number;
  children?: Array<{
    fullName: string;
    age: number;
    image: string;
  }>;
  userImage: string;
}

export interface FormSubmissionData {
  personalInfo: PersonalInfo;
  spiritualInfo: ChurchInfo1 & ChurchInfo2;
}

export interface FormStepData {
  1: PersonalInfo;
  2: ChurchInfo1;
  3: ChurchInfo2;
}

export type StepNumber = 1 | 2 | 3 | 4; 