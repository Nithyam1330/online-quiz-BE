export class Utils {
    static generateRandomPassword() {
        return Math.random().toString(36).substring(5)
    }

    static replaceStringSpacesWithHipens(str: String) {
        return str.toLowerCase().replace(/ /gi, "-")
    }

    static replaceAllSpecialCharactersWithHipens(str: string): string {
      return str.toLowerCase().replace(/[^a-zA-Z]/g, "-")
    }

    static isEmpty(input) {
        if (typeof input === 'undefined') {
          return true;
        } else {
          let lstrTempstring = String(input);
          lstrTempstring = lstrTempstring.trim();
          if (lstrTempstring === '' || lstrTempstring === 'undefined') {
            return true;
          } else {
            return false;
          }
        }
      }
    
      static isUndefined(input) {
        if (typeof input === 'undefined') {
          return true;
        } else {
          return false;
        }
      }
    
      static isNull(input) {
        if (input != null) {
          return false;
        } else {
          return true;
        }
      }

    static isValidInput(input) {
        if (Utils.isNull(input) || Utils.isUndefined(input) || Utils.isEmpty(input)) {
            return false;
        } else {
            return true;
        }
    }
}