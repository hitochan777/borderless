import ISO6391 from "iso-639-1";

export class Language {
  static getAllLanguages(): Language[] {
    return ISO6391.getAllCodes().map((code) => new Language(code));
  }
  private underlyingCode: string;
  constructor(code: string) {
    if (!ISO6391.validate(code)) {
      throw new Error(`${code} does not conform to iso-639-1 code`);
    }
    this.underlyingCode = code;
  }
  get code(): string {
    return this.underlyingCode;
  }
  get name(): string {
    return ISO6391.getNativeName(this.underlyingCode);
  }
}
