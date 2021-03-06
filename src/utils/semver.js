const MAX_LENGTH = 256;
const MAX_SAFE_INTEGER = Number.MAX_SAFE_INTEGER || 9007199254740991;

const NUMERIC_IDENTIFIER = '0|[1-9]\\d*';
const BUILD_IDENTIFIER = `[0-9A-Za-z-]+`;
const NON_NUMERIC_IDENTIFIER = '\\d*[a-zA-Z-][a-zA-Z0-9-]*';
const MAIN_VERSION_IDENTIFIER = `(${NUMERIC_IDENTIFIER})\\.(${NUMERIC_IDENTIFIER})\\.(${NUMERIC_IDENTIFIER})`;
const PRERELEASE_IDENTIFIER = `(?:${NUMERIC_IDENTIFIER}|${NON_NUMERIC_IDENTIFIER})`;
const PRERELEASE = `(?:\\-(${PRERELEASE_IDENTIFIER}(?:\\.${PRERELEASE_IDENTIFIER})*))`;
const BUILD = `(?:\\+(${BUILD_IDENTIFIER}(?:\\.${BUILD_IDENTIFIER})*))`;
const FULL_VERSION_IDENTIFIER = `^v?${MAIN_VERSION_IDENTIFIER}${PRERELEASE}?${BUILD}?$`;

const REGEX_FULL_VERSION = new RegExp(FULL_VERSION_IDENTIFIER);
const REGEX_NUMERIC = /^[0-9]+$/;

export default class SemverVersion {
  constructor(version) {
    if (version instanceof SemverVersion) {
      return version;
    } else if (typeof version !== 'string') {
      throw new TypeError('Invalid Version: ' + version);
    }

    if (version.length > MAX_LENGTH) {
      throw new TypeError(`version is longer than ${MAX_LENGTH} characters`);
    }

    if (!(this instanceof SemverVersion)) {
      return new SemverVersion(version);
    }

    const matches = version.trim().match(REGEX_FULL_VERSION);

    this.rawVersion = version;
    this.major = +matches[1];
    this.minor = +matches[2];
    this.patch = +matches[3];

    this._isThrowVersionNumericError(this.major, 'major');
    this._isThrowVersionNumericError(this.minor, 'minor');
    this._isThrowVersionNumericError(this.patch, 'patch');

    if (matches[4]) {
      this.prereleaseArray = matches[4].split('.').map(function (id) {
        if (REGEX_NUMERIC.test(id)) {
          var num = +id;
          if (num >= 0 && num < MAX_SAFE_INTEGER) {
            return num;
          }
        }
        return id;
      });
    } else {
      this.prereleaseArray = [];
    }

    //this.build = matches[5] ? matches[5].split('.') : [];

    this.prerelease = matches[4];
    this.build = matches[5];
    this.mainVersion = [
      this.major,
      this.minor,
      this.patch
    ].join('.');
    this.version = this.mainVersion
      + (this.prerelease ? `-${this.prerelease}` : '')
      + (this.build ? `+${this.build}` : '');
  }

  _isThrowVersionNumericError(versionNumber, versionName) {
    if (versionNumber > MAX_SAFE_INTEGER || this.major < 0) {
      throw new TypeError(`Invalid ${versionName} version`);
    }
  }

  _isNumeric(numeric) {
    return REGEX_NUMERIC.test(numeric);
  }

  _padNumber(num, fill) {
    const length = ('' + num).length;
    return (Array(
      fill > length ? fill - length + 1 || 0 : 0
    ).join(0) + num);
  }

  static validate(version) {
    return REGEX_FULL_VERSION.test(version);
  }

  mainVersionToNumeric(digit) {
    const numericStr = [
      this._padNumber(this.major, digit),
      this._padNumber(this.minor, digit),
      this._padNumber(this.patch, digit),
    ].join('');
    return parseInt(numericStr);
  }

  compare(other, needCompareBuildVersion = false) {
    let otherSemver = other;
    if (!(other instanceof SemverVersion)) {
      otherSemver = new SemverVersion(other);
    }
    const result = this.compareMainVersion(otherSemver) || this.comparePreReleaseVersion(otherSemver);
    if (!result && needCompareBuildVersion) {
      return this.compareBuildVersion(otherSemver);
    } else {
      return result;
    }
  }

  compareNumeric(a, b) {
    return a > b ? 1 :
      (a < b ? -1 : 0);
  }

  compareIdentifiers(a, b) {
    const aIsNumeric = this._isNumeric(a);
    const bIsNumeric = this._isNumeric(b);
    if (aIsNumeric && bIsNumeric) {
      a = +a;
      b = +b;
    }

    if (aIsNumeric && !bIsNumeric) {
      return -1;
    } else if (bIsNumeric && !aIsNumeric) {
      return 1;
    } else {
      return this.compareNumeric(a, b);
    }
  }

  compareMainVersion(otherSemver) {
    return this.compareNumeric(this.major, otherSemver.major)
      || this.compareNumeric(this.minor, otherSemver.minor)
      || this.compareNumeric(this.patch, otherSemver.patch);
  }

  comparePreReleaseVersion(otherSemver) {
    if (this.prereleaseArray.length && !otherSemver.prereleaseArray.length) {
      return -1;
    } else if (!this.prereleaseArray.length && otherSemver.prereleaseArray.length) {
      return 1;
    } else if (!this.prereleaseArray.length && !otherSemver.prereleaseArray.length) {
      return 0;
    }
    let i = 0;
    do {
      const a = this.prereleaseArray[i];
      const b = otherSemver.prereleaseArray[i];
      if (a === undefined && b === undefined) {
        return 0;
      } else if (b === undefined) {
        return 1;
      } else if (a === undefined) {
        return -1;
      } else if (a === b) {
        continue;
      }
      else {
        return this.compareIdentifiers(a, b);
      }
    } while (++i);
  }

  compareBuildVersion(otherSemver) {
    if (this.build && !otherSemver.build) {
      return 1;
    } else if (!this.build && otherSemver.build) {
      return -1;
    } else {
      return this.compareIdentifiers(this.build, otherSemver.build);
    }
  }
}