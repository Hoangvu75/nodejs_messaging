import { ProfileModel } from "../models/profile";

export class AddProfileValidator {
  name: string;
  birthday: string;

  constructor(name: string, birthday: string) {
    this.name = name;
    this.birthday = birthday;
  }

  isValidName = () => {
    if (this.name.length === 0) {
      return false;
    } else {
      return true;
    }
  }

  isValidBirthday = () => {
    if (this.birthday.length === 0) {
      return false;
    } else {
      return true;
    }
  }
}
