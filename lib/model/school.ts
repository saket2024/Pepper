import { ImageAsset, uid } from "./paper";
export { uid };

export type SchoolProfile = {
  id: string;
  name: string;
  board: string;
  logo?: ImageAsset;
  defaultClassName?: string;
  address?: string;
  createdAt: string;
};

export const defaultSchoolProfiles: SchoolProfile[] = [
  {
    id: "school_st_xaviers",
    name: "St. Xavier's Senior Secondary School",
    board: "CBSE",
    defaultClassName: "Class X",
    address: "New Delhi",
    createdAt: new Date().toISOString(),
  },
  {
    id: "school_govt_excellence",
    name: "राजकीय उत्कृष्ट वरिष्ठ माध्यमिक विद्यालय",
    board: "राज्य शिक्षा बोर्ड",
    defaultClassName: "कक्षा 10वीं",
    address: "जयपुर, राजस्थान",
    createdAt: new Date().toISOString(),
  },
];

export const createDefaultSchool = (): SchoolProfile => ({
  id: uid(),
  name: "Greenwood International Academy",
  board: "ICSE",
  defaultClassName: "Class IX",
  createdAt: new Date().toISOString(),
});
