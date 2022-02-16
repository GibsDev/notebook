import { Icon } from '@iconify/react';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import CheckBoxButton from '../components/CheckBoxButton.jsx';
import clipboard from 'clipboardy';

const CHARS_ALPHA = 'abcdefghijklmnopqrstuvwxyz';
const CHARS_NUM = '0123456789';
const CHARS_SPECIAL_BASE = '!@#$%^&*';
const CHARS_SPECIAL_EXTENDED = '_.,+-=:;?';
const CHARS_SPECIAL_WRAP = '<>[](){}';
const CHARS_SPECIAL_OBSCURE = '/`"|~\'\\';

const clipDefaultIcon = 'lucide:clipboard';
const clipCheckedIcon = 'lucide:clipboard-check';

function shuffle(array) {
    var m = array.length, t, i;
    while (m) {
        i = randomInt(0, --m);
        t = array[m];
        array[m] = array[i];
        array[i] = t;
    }
    return array;
}

function randomString(charPool, length) {
    if (charPool.length > 256) {
        throw Error('charPool size too large for 8 bit integers');
    }
    let randomValues = new Uint8Array(length);
    crypto.getRandomValues(randomValues);
    let out = '';
    for (const value of randomValues) {
        out += charPool.charAt(value % charPool.length);
    }
    return out;
}

function randomInt(min, max) {
    if (min < 0 || max < 0) {
        throw new Error('min and max must be positive');
    }
    if (max < min) {
        throw new Error('max is not > min');
    }
    const num = crypto.getRandomValues(new Uint32Array(1))[0];
    const numValues = (max - min) + 1;
    return (num % numValues) + min;
}

function replaceChar(s, index, replacement) {
    if (s === undefined) {
        throw new Error('s is undefined');
    }
    if (index === undefined) {
        throw new Error('index is undefined');
    }
    if (replacement === undefined) {
        throw new Error('replacement is undefined');
    }
    if (typeof replacement !== 'string' || replacement.length !== 1) {
        throw new Error('Invalid replacement character');
    }
    return s.substr(0, index) + replacement + s.substr(index + replacement.length);
}

class ConstraintSpaceError extends Error {
    constructor() {
        super('Length is too short for constraints');
        this.name = 'ConstraintSpaceError';
    }
}

export default function PasswordGenerator() {

    // Character pool
    const [alpha, alphaCheck] = CheckBoxButton(true, 'alpha', 'Alphabet');
    const [numeric, numericCheck] = CheckBoxButton(true, 'num', 'Numbers');
    const [specBase, specBaseCheck] = CheckBoxButton(true, 'specBase', CHARS_SPECIAL_BASE, 'Special base');
    const [specExt, specExtCheck] = CheckBoxButton(true, 'specExt', CHARS_SPECIAL_EXTENDED, 'Special extended');
    const [specWrap, specWrapCheck] = CheckBoxButton(true, 'specWrap', CHARS_SPECIAL_WRAP, 'Special wrap');
    const [specObs, specObsCheck] = CheckBoxButton(false, 'specObs', CHARS_SPECIAL_OBSCURE, 'Special obscure');
    const [customChars, setCustom] = useState('');

    // Restrictions
    const [upper, upperCheck] = CheckBoxButton(true, 'upper', 'Uppercase', 'At least one upper case character');
    const [lower, lowerCheck] = CheckBoxButton(true, 'lower', 'Lowercase', 'At least one lower case character');
    const [number, numberCheck] = CheckBoxButton(true, 'number', 'Number', 'At least one number character');
    const [custom, customCheck] = CheckBoxButton(true, 'custom', 'Custom', 'At least one custom character');


    const [length, setLength] = useState(16);

    const [clipIcon, setClipIcon] = useState(clipDefaultIcon);

    function generatePassword() {
        let pool = '';
        if (alpha) pool += CHARS_ALPHA;
        if (numeric) pool += CHARS_NUM;
        if (specBase) pool += CHARS_SPECIAL_BASE;
        if (specExt) pool += CHARS_SPECIAL_EXTENDED;
        if (specWrap) pool += CHARS_SPECIAL_WRAP;
        if (specObs) pool += CHARS_SPECIAL_OBSCURE;
        if (customChars) {
            pool += customChars;
            pool = pool.split('');
            // Remove duplicates
            pool = pool.filter((value, index, self) => {
                return self.indexOf(value) === index;
            });
            pool = pool.join('');
        }
        // Generate base password
        let password = randomString(pool, length);

        // Create a random list of indexes for modifications
        let modIndexes = new Array(length);
        for (let i = 0; i < length; i++) {
            modIndexes[i] = i;
        }
        modIndexes = shuffle(modIndexes);

        // Appply minimum contraints
        try {
            if (upper) {
                const index = modIndexes.pop();
                if (index === undefined) throw new ConstraintSpaceError();
                const char = CHARS_ALPHA.toUpperCase()[randomInt(0, CHARS_ALPHA.length - 1)];
                password = replaceChar(password, index, char);
            }
            if (lower) {
                const index = modIndexes.pop();
                if (index === undefined) throw new ConstraintSpaceError();
                const char = CHARS_ALPHA[randomInt(0, CHARS_ALPHA.length - 1)];
                password = replaceChar(password, index, char);
            }
            if (number) {
                const index = modIndexes.pop();
                if (index === undefined) throw new ConstraintSpaceError();
                const char = CHARS_NUM[randomInt(0, CHARS_NUM.length - 1)];
                password = replaceChar(password, index, char);
            }
            if (custom && customChars) {
                const index = modIndexes.pop();
                if (index === undefined) throw new ConstraintSpaceError();
                const char = customChars[randomInt(0, customChars.length - 1)];
                password = replaceChar(password, index, char);
            }
            
            clipboard.write(password).then(() => {
                setClipIcon(clipCheckedIcon);
            }).catch(() => {
                toast.error('Could not copy to clipboard');
            });
        } catch (e) {
            if (e instanceof ConstraintSpaceError) {
                toast.error(e.message);
            } else {
                console.error(e);
            }
        }
    }

    // Reset clipboard icon
    useEffect(() => {
        if (clipIcon != clipDefaultIcon) {
            setTimeout(() => {
                setClipIcon(clipDefaultIcon);
            }, 1500);
        }
    }, [clipIcon]);

    return (
        <div className="card bg-dark">
            <div className="card-body text-white d-flex flex-column gap-3">
                <span>Character Pool</span>
                <div className="d-flex flex-wrap gap-2 align-content-between">
                    {alphaCheck}
                    {numericCheck}
                    {specBaseCheck}
                    {specExtCheck}
                    {specWrapCheck}
                    {specObsCheck}

                    <div className="input-group" title="Custom characters">
                        <span className="input-group-text">Custom</span>
                        <input type="text"
                            className="form-control"
                            aria-label="Custom characters"
                            value={customChars}
                            onChange={e => setCustom(e.target.value)} />
                    </div>
                </div>
                <span>Constraints</span>
                <div className="d-flex flex-wrap gap-2 align-content-between">
                    {upperCheck}
                    {lowerCheck}
                    {numberCheck}
                    {customCheck}

                    <div className="input-group">
                        <span className="input-group-text">Length</span>
                        <input type="number"
                            className="form-control"
                            aria-label="Length"
                            value={length}
                            onChange={e => setLength(e.target.value)} />
                    </div>
                </div>

                <button className="btn btn-secondary"
                    onClick={generatePassword}>
                    Generate <Icon icon={clipIcon} />
                </button>
            </div>
        </div>

    );
}