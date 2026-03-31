import VerZero from './VerZero';
import VerOne from './VerOne';

const versions = {
    VerZero,
    VerOne,
} as const;

export type VersionKey = keyof typeof versions;

export default versions;
