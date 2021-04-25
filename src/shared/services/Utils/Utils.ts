export class Utils {
    static generateRandomPassword() {
        return Math.random().toString(36).substring(5)
    }

    static replaceStringSpacesWithHipens(str: String) {
        return str.toLowerCase().replace(/ /gi, "-")
    }
}