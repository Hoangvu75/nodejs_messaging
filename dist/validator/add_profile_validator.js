"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AddProfileValidator = void 0;
class AddProfileValidator {
    constructor(name, birthday) {
        this.isValidName = () => {
            if (this.name.length === 0) {
                return false;
            }
            else {
                return true;
            }
        };
        this.isValidBirthday = () => {
            if (this.birthday.length === 0) {
                return false;
            }
            else {
                return true;
            }
        };
        this.name = name;
        this.birthday = birthday;
    }
}
exports.AddProfileValidator = AddProfileValidator;
