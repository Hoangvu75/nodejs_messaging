import { AccountModel } from "../models/account";

export class LoginValidator {
    phone: string;
    password: string;
  
    constructor(phone: string, password: string) {
      this.phone = phone;
      this.password = password;
    }
  
    isValidPhone = () => {
      const phoneValidator = /^(\()?\d{3}(\))?(|\s)?\d{3}(|\s)\d{4}$/;
      if (!this.phone.match(phoneValidator)) {
        return false;
      } else {
        return true;
      }
    }
    
    isValidPassword = () => {
      if (this.password.length < 8) {
        return false;
      } else {
        return true;
      }
    }
    
    isValidLoginAccount = async () => {
      const isAccountExist = await AccountModel.findOne({
        phone: this.phone,
      });
    
      if (isAccountExist) {
        return false;
      } else {
        return true;
      }
    }
  }